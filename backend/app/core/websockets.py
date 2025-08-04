# app/core/websockets.py
from fastapi import WebSocket

class ConnectionManager:
    """Manages active WebSocket connections."""
    def __init__(self):
        # A dictionary to store active connections, mapping user_id to WebSocket object
        self.active_connections: dict[int, WebSocket] = {}

    async def connect(self, websocket: WebSocket, user_id: int):
        """Accepts a new WebSocket connection and stores it."""
        await websocket.accept()
        self.active_connections[user_id] = websocket

    def disconnect(self, user_id: int):
        """Removes a WebSocket connection."""
        if user_id in self.active_connections:
            del self.active_connections[user_id]

    async def send_personal_message(self, message: dict, user_id: int):
        """Sends a JSON message to a specific user."""
        if user_id in self.active_connections:
            websocket = self.active_connections[user_id]
            await websocket.send_json(message)

# Create a global instance of the ConnectionManager
manager = ConnectionManager()