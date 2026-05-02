import React, { useState } from 'react';
import { X, Delete, Command } from 'lucide-react';
import './Calculator.css';

interface CalculatorProps {
  onClose: () => void;
}

const Calculator: React.FC<CalculatorProps> = ({ onClose }) => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');

  const handleNumber = (num: string) => {
    setDisplay(prev => (prev === '0' ? num : prev + num));
  };

  const handleOperator = (op: string) => {
    setEquation(display + ' ' + op + ' ');
    setDisplay('0');
  };

  const handleEqual = () => {
    try {
      // Simple eval-like logic for basic math
      const [left, op, right] = equation.split(' ');
      const l = parseFloat(left);
      const r = parseFloat(display);
      let result = 0;

      if (op === '+') result = l + r;
      if (op === '-') result = l - r;
      if (op === '×') result = l * r;
      if (op === '÷') result = l / (r || 1);

      setDisplay(result.toString());
      setEquation('');
    } catch (e) {
      setDisplay('Error');
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
  };

  return (
    <div className="calculator-overlay" onClick={onClose}>
      <div className="calculator-card" onClick={e => e.stopPropagation()}>
        <header className="calc-header">
          <div className="calc-title">
            <Command size={18} />
            <span>MATH TOOL</span>
          </div>
          <button className="calc-close" onClick={onClose}><X size={20} /></button>
        </header>

        <div className="calc-display-area">
          <div className="calc-equation">{equation}</div>
          <div className="calc-display">{display}</div>
        </div>

        <div className="calc-grid">
          <button onClick={handleClear} className="calc-btn btn-clear">AC</button>
          <button onClick={() => handleOperator('÷')} className="calc-btn btn-op">÷</button>
          <button onClick={() => handleOperator('×')} className="calc-btn btn-op">×</button>
          
          <button onClick={() => handleNumber('7')} className="calc-btn">7</button>
          <button onClick={() => handleNumber('8')} className="calc-btn">8</button>
          <button onClick={() => handleNumber('9')} className="calc-btn">9</button>
          <button onClick={() => handleOperator('-')} className="calc-btn btn-op">-</button>
          
          <button onClick={() => handleNumber('4')} className="calc-btn">4</button>
          <button onClick={() => handleNumber('5')} className="calc-btn">5</button>
          <button onClick={() => handleNumber('6')} className="calc-btn">6</button>
          <button onClick={() => handleOperator('+')} className="calc-btn btn-op">+</button>
          
          <button onClick={() => handleNumber('1')} className="calc-btn">1</button>
          <button onClick={() => handleNumber('2')} className="calc-btn">2</button>
          <button onClick={() => handleNumber('3')} className="calc-btn">3</button>
          <button onClick={handleEqual} className="calc-btn btn-equal">=</button>
          
          <button onClick={() => handleNumber('0')} className="calc-btn btn-zero">0</button>
          <button onClick={() => handleNumber('.')} className="calc-btn">.</button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
