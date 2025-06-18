import os
import logging
from flask import Flask, render_template, request, jsonify

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Create the app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "eco_alerte_secret_key_2024")

# Routes
@app.route('/')
def index():
    """Homepage with compelling environmental message"""
    return render_template('index.html')

@app.route('/info')
def info():
    """Information page with environmental data and statistics"""
    return render_template('info.html')

@app.route('/quiz')
def quiz():
    """Interactive quiz for environmental education"""
    return render_template('quiz.html')

@app.route('/actions')
def actions():
    """Action page with practical daily eco-friendly tips"""
    return render_template('actions.html')

@app.route('/share')
def share():
    """Share page with social media integration"""
    return render_template('share.html')

@app.route('/api/quiz/submit', methods=['POST'])
def submit_quiz():
    """Handle quiz submission and return results"""
    try:
        data = request.get_json()
        answers = data.get('answers', {})

        # Quiz scoring logic
        correct_answers = {
            'q1': 'b',  # 8 million tons of plastic
            'q2': 'c',  # 14% of greenhouse gases
            'q3': 'a',  # 1/3 of food produced
            'q4': 'b',  # LED bulbs use 80% less energy
            'q5': 'c'   # Transport accounts for 24% of emissions
        }

        score = 0
        total_questions = len(correct_answers)

        for question, correct_answer in correct_answers.items():
            if answers.get(question) == correct_answer:
                score += 1

        percentage = (score / total_questions) * 100

        # Generate personalized message based on score
        if percentage >= 80:
            message = "Excellent! Vous êtes un vrai champion de l'environnement! 🌟"
            level = "Expert Écologique"
        elif percentage >= 60:
            message = "Très bien! Vous avez de bonnes connaissances environnementales! 🌱"
            level = "Gardien de la Nature"
        elif percentage >= 40:
            message = "Pas mal! Il y a encore quelques points à améliorer. 🌿"
            level = "Apprenti Écolo"
        else:
            message = "C'est un début! Explorez notre site pour en apprendre plus! 🌍"
            level = "Novice Vert"

        return jsonify({
            'success': True,
            'score': score,
            'total': total_questions,
            'percentage': percentage,
            'message': message,
            'level': level
        })

    except Exception as e:
        logging.error(f"Quiz submission error: {e}")
        return jsonify({'success': False, 'error': 'Une erreur est survenue'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
