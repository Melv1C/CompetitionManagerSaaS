import socketio
from SiteResult import SiteResult
from db import connect_to_local_db

SERVER_URL = "http://competitionmanager.be:8080"

COMPET_EID = "e619a020-9026-4373-bb34-8debf446185f"

EVENT_EID = "64f81264-3327-48ce-972e-54f61126735a"

local_db = connect_to_local_db()

sio = socketio.Client()

@sio.event
def connect():
    print("Connected to the server")

    # Join a competition room
    sio.emit("join:competition", COMPET_EID)

    # # Join an event room
    # sio.emit("join:event", EVENT_EID)

@sio.event
def disconnect():
    print("Disconnected from the server")

@sio.on("competition:joined")
def on_competition_joined(data):
    print(f"Joined competition: {data}")

@sio.on("event:joined")
def on_event_joined(data):
    print(f"Joined event: {data}")

@sio.on("result:new")
def on_new_result(data):
    print("New result received")
    result = SiteResult.init_from_socketio(data)
    result.upsert_to_local_db(local_db)

# Optional: Handle error messages
@sio.event
def error(data):
    print(f"Error: {data}")

# Connect to the server
sio.connect(SERVER_URL)

# Keep the program running to receive events
sio.wait()