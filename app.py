import os
from flask import Flask, render_template, request, redirect, url_for
import openai
import difflib
import re

app = Flask(__name__)
app.debug = True
openai.api_key = os.getenv("OPENAI_API_KEY")

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        essay_text = request.form['essay']
        exam = request.form['exam']

        exam, score, revised_essay, advice = evaluate_essay(exam, essay_text)

        return render_template('result.html', exam=exam, score=score, original_essay=essay_text, revised_essay=revised_essay, advice=advice)
    return render_template('index.html')


def process_response(response_text):
    exam_pattern = r'Exam Selected: (.*?)\n'
    score_pattern = r"Score: (.*?)\n"
    revised_essay_pattern = r'3\. Revised Essay:(.*?)4\. Advice:'
    advice_pattern = r'4\. Advice:(.*?)$'

    # revised_essay_pattern = r'Revised Essay:(.*?)\n\n4\. Advice:'
    # advice_pattern = r'Advice:(.*?)$'
    #advice_pattern = r'Advice:(.*?)\n\n'


    exam_match = re.search(exam_pattern, response_text, re.DOTALL)
    score_match = re.search(score_pattern, response_text, re.DOTALL)
    revised_essay_match = re.search(revised_essay_pattern, response_text, re.DOTALL)
    advice_match = re.search(advice_pattern, response_text, re.DOTALL)

    exam = exam_match.group(1).strip() if exam_match else None
    score = score_match.group(1).strip() if score_match else None
    revised_essay = revised_essay_match.group(1).strip() if revised_essay_match else None
    advice = advice_match.group(1).strip() if advice_match else None
    return exam, score, revised_essay, advice


def evaluate_essay(exam, essay_text):
    
    prompt = f"""Act as a professional English teacher and evaluate the following essay based on the {exam} criteria.
                If "英検", you should rate it with one of the following: "英検2級", "英検準1級","英検1級",
                If TOEFL, you should rate it out of 30
                if IELTS, you should rate it out of 9.0
                If TOEIC, you should rate it like "880 level"

                The essay: \n\n{essay_text}\n\n
    
                You MUST respond with the following format:
                1. Exam Selected: {{exam}}
                2. Score: {{score}}
                3. Revised Essay: {{your revised essay}}
                4. Advice: {{your advice}}

                """
    
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=prompt,
        max_tokens=1000,
        n=1,
        presence_penalty=1.0,
        stop=None,
        temperature=0.5,
    )

    exam, score, revised_essay, advice = process_response(response.choices[0].text)
    return exam, score, revised_essay, advice


def highlight_differences(original, revised):
    differ = difflib.Differ()
    diff = list(differ.compare(original.split(), revised.split()))
    highlighted_text = []
    for token in diff:
        if token.startswith('+'):
            highlighted_text.append(f'<b>{token[2:]}</b>')
        elif not token.startswith('-'):
            highlighted_text.append(token[2:])
    return ' '.join(highlighted_text)


@app.route('/restart', methods=['GET'])
def restart():
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run()
