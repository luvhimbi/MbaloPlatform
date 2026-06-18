import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { QuizQuestion } from '../types/curriculum';
import type { UserLexemeState } from '../types/srs';
import { calculateRecallProbability, reduceLexemeState, createInitialLexemeState } from '../utils/hlrEngine';

const TARGET_PROBABILITY = 0.50; // The "Goldilocks Zone"

export function useExerciseSelector(userId: string | undefined, exercisePool: QuizQuestion[]) {
  const [lexemeStates, setLexemeStates] = useState<Record<string, UserLexemeState>>({});
  const [selectedExercise, setSelectedExercise] = useState<QuizQuestion | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the user's lexeme states exactly once when the pool or user changes
  useEffect(() => {
    let isMounted = true;

    async function fetchStates() {
      if (!userId || exercisePool.length === 0) {
        if (isMounted) setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const statesRef = collection(db, `users/${userId}/lexemeStates`);
        const snapshot = await getDocs(statesRef);
        const stateMap: Record<string, UserLexemeState> = {};
        
        snapshot.forEach(doc => {
          stateMap[doc.id] = doc.data() as UserLexemeState;
        });

        if (isMounted) {
          setLexemeStates(stateMap);
        }
      } catch (error) {
        console.error("Failed to fetch lexeme states:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchStates();

    return () => { isMounted = false; };
  }, [userId, exercisePool]);

  // The Birdbrain Selector Algorithm
  useEffect(() => {
    if (isLoading || exercisePool.length === 0) return;

    const currentTimeMs = Date.now();

    // Rank the exercises
    const rankedExercises = exercisePool.map(exercise => {
      // 1. Get the lexemes for this exercise. If none, fallback to using the exercise ID itself as a lexeme.
      const lexemeIds = exercise.lexemeIds?.length ? exercise.lexemeIds : [exercise.id];
      const intrinsicDifficulty = exercise.difficulty || 1.0;

      // 2. Calculate probabilities for all lexemes in the exercise
      const probabilities = lexemeIds.map(lId => {
        const state = lexemeStates[lId];
        if (!state) return 0; // Needs learning (probability 0)
        return calculateRecallProbability(state, currentTimeMs);
      });

      // 3. Aggregate probability (we use the average, though min() is also valid for strict mastery)
      const avgProbability = probabilities.reduce((sum, p) => sum + p, 0) / probabilities.length;

      // 4. Calculate cost. Cost is the absolute distance from the TARGET_PROBABILITY (0.50)
      // We also add a small penalty based on intrinsic difficulty to break ties.
      const probabilityCost = Math.abs(avgProbability - TARGET_PROBABILITY);
      const totalCost = probabilityCost + (intrinsicDifficulty * 0.01);

      return {
        exercise,
        cost: totalCost
      };
    });

    // 5. Sort by lowest cost
    rankedExercises.sort((a, b) => a.cost - b.cost);

    // 6. Select the optimal exercise
    setSelectedExercise(rankedExercises[0]?.exercise || null);

  }, [lexemeStates, exercisePool, isLoading]);

  // The onSubmit handler
  const onSubmitAnswer = useCallback(async (isCorrect: boolean) => {
    if (!userId || !selectedExercise) return;

    const lexemeIds = selectedExercise.lexemeIds?.length ? selectedExercise.lexemeIds : [selectedExercise.id];
    const intrinsicDifficulty = selectedExercise.difficulty || 1.0;

    const batch = writeBatch(db);
    const updatedStates = { ...lexemeStates };

    lexemeIds.forEach(lId => {
      const currentState = updatedStates[lId] || createInitialLexemeState(lId);
      const newState = reduceLexemeState(currentState, isCorrect, intrinsicDifficulty);
      
      updatedStates[lId] = newState;

      const docRef = doc(db, `users/${userId}/lexemeStates`, lId);
      batch.set(docRef, newState); // Atomic batch set
    });

    try {
      await batch.commit();
      // Update local state so the next selection is immediately accurate without re-fetching
      setLexemeStates(updatedStates);
    } catch (error) {
      console.error("Failed to commit spaced repetition batch:", error);
    }
  }, [userId, selectedExercise, lexemeStates]);

  return {
    selectedExercise,
    isLoading,
    onSubmitAnswer
  };
}
