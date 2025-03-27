<h1>Evaluator API Documentation</h1>
<p>This module provides an API to calculate evaluation scores for semantic descriptions extracted through the <strong>Extraction API Module</strong>.</p>

<h2>Overview</h2>
<ul>
  <li>You only need to import <code>main.py</code> to use this module.</li>
  <li>All other modules are helper files used internally by <code>main.py</code> and do not require user interaction.</li>
</ul>

<h2>Module Components</h2>
<p>The module includes two primary classes:</p>
<ul>
  <li><code>GoldenMatrix</code> – Used by teachers during competition creation to generate the Golden Matrix and train the model.</li>
  <li><code>Evaluator</code> – Used to evaluate student ideas by comparing their semantic descriptions with the stored Golden Matrix.</li>
</ul>

<h2>Competition Creation (Golden Matrix & Model Training)</h2>
<ol>
  <li><strong>Import</strong> <code>main.py</code> in your script.</li>
  <li><strong>Initialize</strong> a <code>GoldenMatrix</code> object:</li>
  <pre><code>mat_creation = GoldenMatrix()</code></pre>
  <li><strong>Run</strong> the <code>init()</code> method to create and store the Golden Matrix and trained model:</li>
  <pre><code>mat_creation.init()</code></pre>
</ol>

<h2>Idea Evaluation (Scoring Student Submissions)</h2>
<ol>
  <li><strong>Import</strong> <code>main.py</code> in your script.</li>
  <li><strong>Prepare Input</strong> for the <code>Evaluator</code> class. Input should be a string with semantic descriptions for any of a submission formats:</li>
  <code>semantic_descriptions = *Sementic Desription*</code>
  <li><strong>Create</strong> an <code>Evaluator</code> object and pass the input:</li>
  <pre><code>evaluator = Evaluator(semantic_descriptions)</code></pre>
  <li><strong>Run</strong> the evaluation by calling the <code>run()</code> method:</li>
  <pre><code>final_score = evaluator.run()</code></pre>
  <li><code>run()</code> returns the final evaluation score of the provided semantic descriptions.</li>
</ol>

<h2>Note:</h2>
<ul>
  <li>Golden Matrices and trained models are stored in the database during competition creation.</li>
  <li><code>Evaluator</code> retrieves these matrices for comparison during student idea evaluation.</li>
</ul>

<h2>Thank you for using the Evaluator API. 🚀</h2>

<h2>Dependencies/Python Libraries to install</h2>
<ul>
<li>nltk</li>
<li>scikit-learn</li>
<li>scipy</li>
<li>numpy</li>
</ul>

---

## To start with venv

```bash
python3 -m venv venv
source venv/bin/activate
```

## To start the flask server

- go to `\ml` directory
- run the following command:

```bash
 python -m flask_api.main
```

---
