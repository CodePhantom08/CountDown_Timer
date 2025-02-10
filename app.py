from flask import Flask, render_template, request, jsonify
import time
import threading

app = Flask(__name__)

timer_data = {'time_left': 0, 'running': False}

def countdown(t):
    global timer_data
    timer_data['running'] = True
    while t > 0 and timer_data['running']:
        time.sleep(1)
        t -= 1
        timer_data['time_left'] = t
    timer_data['running'] = False

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/start', methods=['POST'])
def start_timer():
    global timer_data
    t = int(request.json['time'])
    if not timer_data['running']:
        timer_data['time_left'] = t
        thread = threading.Thread(target=countdown, args=(t,))
        thread.start()
        return jsonify({'message': 'Timer started!'}), 200
    return jsonify({'message': 'Timer already running!'}), 400

@app.route('/status', methods=['GET'])
def get_status():
    return jsonify(timer_data)

@app.route('/stop', methods=['POST'])
def stop_timer():
    global timer_data
    timer_data['running'] = False
    return jsonify({'message': 'Timer stopped!'}), 200

if __name__ == '__main__':
    app.run(debug=True)
