import { X } from 'lucide-react';
import { useLevelStore } from '../store/useLevelStore';
import type { TestResult } from '../types/level';

function formatTruthTable(inputs: Record<string, 0 | 1>): string {
  return Object.entries(inputs)
    .map(([k, v]) => `${k}=${v}`)
    .join(', ');
}

function ResultRow({ result }: { result: TestResult }) {
  const outputsMatch = Object.entries(result.entry.expectedOutputs).every(
    ([key, expected]) => result.actualOutputs[key] === expected,
  );

  return (
    <div
      className={`p-2 rounded border ${
        result.passed
          ? 'border-matrix-green/50 bg-matrix-green/5'
          : 'border-matrix-red/50 bg-matrix-red/5'
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className={`text-lg ${result.passed ? 'text-matrix-green' : 'text-matrix-red'}`}>
          {result.passed ? '✓' : '✗'}
        </span>
        <span className="text-matrix-green/70 font-mono text-xs">
          Input: ({formatTruthTable(result.entry.inputs)})
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
        {Object.entries(result.entry.expectedOutputs).map(([key, expected]) => {
          const actual = result.actualOutputs[key];
          const correct = actual === expected;
          return (
            <div key={key} className="flex justify-between">
              <span className="text-matrix-green/50">{key}:</span>
              <span className={correct ? 'text-matrix-green' : 'text-matrix-red'}>
                expected={expected}, actual={actual}
                {!correct && ' (WRONG)'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function TestResults() {
  const { testResults, showTestResults, toggleTestResults, currentLevel } = useLevelStore();

  if (!showTestResults) return null;

  const allPassed = testResults.length > 0 && testResults.every((r) => r.passed);
  const passedCount = testResults.filter((r) => r.passed).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-black border-2 border-matrix-green rounded-lg p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="text-matrix-green font-mono font-bold text-lg">
            ╔═══ TEST RESULTS ═══╗
          </div>
          <button
            onClick={toggleTestResults}
            className="p-1 text-matrix-green/70 hover:text-matrix-green transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-4 p-3 rounded border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-matrix-green/70 font-mono text-sm">
              Level: {currentLevel?.name}
            </span>
            <span
              className={`font-mono font-bold ${
                allPassed ? 'text-matrix-green' : 'text-matrix-red'
              }`}
            >
              {allPassed ? '✓ ALL PASSED' : `✗ ${passedCount}/${testResults.length} PASSED`}
            </span>
          </div>
          <div className="w-full h-2 bg-matrix-green/20 rounded overflow-hidden">
            <div
              className={`h-full transition-all ${
                allPassed ? 'bg-matrix-green' : 'bg-matrix-amber'
              }`}
              style={{ width: `${(passedCount / testResults.length) * 100}%` }}
            />
          </div>
        </div>

        {allPassed && (
          <div className="mb-4 p-3 bg-matrix-green/10 border border-matrix-green/50 rounded text-center">
            <div className="text-matrix-green font-mono font-bold text-lg animate-pulse">
              🎉 CONGRATULATIONS!
            </div>
            <div className="text-matrix-green/70 font-mono text-sm mt-1">
              你成功构建了 {currentLevel?.name}！
            </div>
          </div>
        )}

        <div className="text-matrix-green/50 font-mono text-xs mb-2">
          TRUTH TABLE:
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-matrix space-y-2 pr-2">
          {testResults.length === 0 ? (
            <div className="text-matrix-green/30 font-mono text-center py-8">
              No test results yet.<br />
              Click "RUN TEST" to test your circuit.
            </div>
          ) : (
            testResults.map((result, index) => (
              <ResultRow key={index} result={result} />
            ))
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-matrix-green/20 flex gap-3">
          <button
            onClick={toggleTestResults}
            className="flex-1 py-2 text-xs font-mono rounded border border-matrix-green/50 text-matrix-green/70 hover:border-matrix-green hover:text-matrix-green transition-all"
          >
            CLOSE
          </button>
          {!allPassed && (
            <button
              onClick={() => {
                toggleTestResults();
                useLevelStore.getState().runTest();
              }}
              className="flex-1 py-2 text-xs font-mono font-bold rounded border border-matrix-green bg-matrix-green/10 text-matrix-green hover:bg-matrix-green/20 transition-all"
            >
              RETEST
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
