from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)
app.secret_key = "your_secret_key"

form_id = "1FAIpQLSc09iPD8vfUu3v7zM0PZxznyaKTpi7DgnZRU3o1Q6xCcunXFQ"  # Replace with your actual form ID
base_url = f"https://docs.google.com/forms/d/e/{form_id}/formResponse"



@app.route('/')
def home():
    return render_template('index.html')

@app.route('/submit', methods=['POST'])
def submit_form():
    try:
        # Access form data
        name = request.form.get("name")
        email = request.form.get("email")
        address = request.form.get("address")

        # Validate input
        if not name or not email or not address:
            return jsonify({"error": "Missing data"}), 400

        submission_url = f"{base_url}?&entry.2005620554={name}&entry.1045781291={email}&entry.1065046570={address}"
        #replace wiht you actual&entry.2005620554={name}&entry.1045781291={email}&entry.1065046570={address}

        response = requests.post(submission_url)
        # Check the response status code
        if response.status_code in [200, 302]:  # 302 is typical for Google Forms
            return jsonify({"message": "Form submitted successfully!"}), 200
        else:
            return jsonify({"error": "Failed to submit data", "status_code": response.status_code}), 500

    except Exception as e:
        return jsonify({"error": f"Failed to submit form: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
