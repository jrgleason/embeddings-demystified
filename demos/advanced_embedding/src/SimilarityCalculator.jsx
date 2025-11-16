import { useState } from 'react';
import './SimilarityCalculator.css';

export default function SimilarityCalculator() {
  const [text1, setText1] = useState('The cat sleeps on the mat');
  const [text2, setText2] = useState('A feline rests on the rug');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const calculateSimilarity = async () => {
    if (!text1.trim() || !text2.trim()) {
      setError('Both text fields are required');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/similarity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text1, text2 })
      });

      if (!response.ok) {
        throw new Error('Failed to calculate similarity');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getSimilarityColor = (score) => {
    if (score > 0.9) return '#22c55e'; // green
    if (score > 0.7) return '#3b82f6'; // blue
    if (score > 0.5) return '#f59e0b'; // orange
    if (score > 0.3) return '#ef4444'; // red
    return '#991b1b'; // dark red
  };

  return (
    <div className="similarity-calculator">
      <h2>Step-by-Step Cosine Similarity</h2>
      <p className="subtitle">Compare two texts using OpenAI embeddings and transformers.js</p>

      <div className="input-section">
        <div className="input-group">
          <label htmlFor="text1">Text 1:</label>
          <input
            id="text1"
            type="text"
            value={text1}
            onChange={(e) => setText1(e.target.value)}
            placeholder="Enter first text..."
          />
        </div>

        <div className="input-group">
          <label htmlFor="text2">Text 2:</label>
          <input
            id="text2"
            type="text"
            value={text2}
            onChange={(e) => setText2(e.target.value)}
            placeholder="Enter second text..."
          />
        </div>

        <button
          onClick={calculateSimilarity}
          disabled={loading}
          className="calculate-btn"
        >
          {loading ? 'Calculating...' : 'Calculate Similarity'}
        </button>

        {error && <div className="error">{error}</div>}
      </div>

      {result && (
        <div className="results">
          <div className="similarity-score" style={{ borderColor: getSimilarityColor(result.summary.similarity) }}>
            <div className="score-label">Cosine Similarity</div>
            <div className="score-value" style={{ color: getSimilarityColor(result.summary.similarity) }}>
              {result.summary.similarity.toFixed(6)}
            </div>
            <div className="interpretation">{result.summary.interpretation}</div>
          </div>

          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Generate Embeddings</h3>
                <p className="step-description">{result.steps.step1_embeddings.description}</p>
                <div className="step-details">
                  <div className="detail-row">
                    <span className="detail-label">Vector Dimensions:</span>
                    <span className="detail-value">{result.steps.step1_embeddings.vector1_dimensions}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Vector 1 preview:</span>
                    <span className="detail-value mono">
                      [{result.steps.step1_embeddings.vector1_preview.map(v => v.toFixed(4)).join(', ')}...]
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Vector 2 preview:</span>
                    <span className="detail-value mono">
                      [{result.steps.step1_embeddings.vector2_preview.map(v => v.toFixed(4)).join(', ')}...]
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Calculate Dot Product</h3>
                <p className="step-description">{result.steps.step2_dot_product.description}</p>
                <div className="formula">{result.steps.step2_dot_product.formula}</div>
                <div className="step-details">
                  <div className="detail-row">
                    <span className="detail-label">Result:</span>
                    <span className="detail-value">{result.steps.step2_dot_product.result.toFixed(6)}</span>
                  </div>
                  <div className="example-terms">
                    <div className="example-label">Example terms:</div>
                    {result.steps.step2_dot_product.example_terms.map((term, idx) => (
                      <div key={idx} className="mono small">{term.calculation}</div>
                    ))}
                    <div className="mono small">... ({result.steps.step1_embeddings.vector1_dimensions - 3} more terms)</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Calculate Magnitudes</h3>
                <p className="step-description">{result.steps.step3_magnitudes.description}</p>
                <div className="formula">{result.steps.step3_magnitudes.formula}</div>
                <div className="step-details">
                  <div className="detail-row">
                    <span className="detail-label">Magnitude 1:</span>
                    <span className="detail-value">{result.steps.step3_magnitudes.magnitude1.toFixed(6)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Magnitude 2:</span>
                    <span className="detail-value">{result.steps.step3_magnitudes.magnitude2.toFixed(6)}</span>
                  </div>
                  <div className="example-terms">
                    <div className="example-label">Example terms (Vector 1):</div>
                    {result.steps.step3_magnitudes.example_terms_vector1.map((term, idx) => (
                      <div key={idx} className="mono small">{term.calculation}</div>
                    ))}
                    <div className="mono small">... ({result.steps.step1_embeddings.vector1_dimensions - 3} more terms)</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Calculate Cosine Similarity</h3>
                <p className="step-description">{result.steps.step4_cosine_similarity.description}</p>
                <div className="formula">{result.steps.step4_cosine_similarity.formula}</div>
                <div className="step-details">
                  <div className="detail-row">
                    <span className="detail-label">Numerator (dot product):</span>
                    <span className="detail-value">{result.steps.step4_cosine_similarity.numerator.toFixed(6)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Denominator (mag₁ × mag₂):</span>
                    <span className="detail-value">{result.steps.step4_cosine_similarity.denominator.toFixed(6)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Final Result:</span>
                    <span className="detail-value highlight">
                      {result.steps.step4_cosine_similarity.result.toFixed(6)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="step">
              <div className="step-number">5</div>
              <div className="step-content">
                <h3>Interpret the Result</h3>
                <p className="step-description">Understanding the similarity score</p>
                <div className="similarity-scale">
                  <div className="scale-item">
                    <span className="scale-range">1.0</span>
                    <span className="scale-meaning">{result.steps.step5_interpretation.scale['1.0']}</span>
                  </div>
                  <div className="scale-item">
                    <span className="scale-range">0.7-0.9</span>
                    <span className="scale-meaning">{result.steps.step5_interpretation.scale['0.7-0.9']}</span>
                  </div>
                  <div className="scale-item">
                    <span className="scale-range">0.5-0.7</span>
                    <span className="scale-meaning">{result.steps.step5_interpretation.scale['0.5-0.7']}</span>
                  </div>
                  <div className="scale-item">
                    <span className="scale-range">0.3-0.5</span>
                    <span className="scale-meaning">{result.steps.step5_interpretation.scale['0.3-0.5']}</span>
                  </div>
                  <div className="scale-item">
                    <span className="scale-range">0.0-0.3</span>
                    <span className="scale-meaning">{result.steps.step5_interpretation.scale['0.0-0.3']}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
