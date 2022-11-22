# Diana Music Tool API Documentation

## User

### Create
- `http://localhost:3000/user/register`
  - Req: 
    - username: String(1-30), required, unique
    - email: Email, required, unique
    - password: String(1-30), required
  - Res:
    - 200: Success
    - 400: Invalid or missing input
    - 409: Duplicate email or username
    - other: other error

- `http://localhost:3000/user/login`
  - Req: 
    - email: Email, required, unique
    - password: String(1-30), required
  - Res:
    - 200: Success
      - data: token 
    - 404: User doesn't exist
    - 401: Incorrect password

- `http://localhost:3000/user/password-change`
  - Header: token 
  - Req:
    - newpassword: String(1-30), required
  - Res:
    - 200: Success
    - 400: Invalid or missing input
    - 401: No token
    - 403: Token expired or invalid
    - other: other error

- `http://localhost:3000/user/auth/google`
  - Res:
    - 200: Success
      - data: token 
    - other: Google error

## Track

### Read
- `http://localhost:3000/track/search/:name`
  - Req:
    - name: String(1-30), required
  - Res:
    - Array of tracks matching input name
    - 400: Invalid or missing input
    - other: other error

- `http://localhost:3000/track/search/:id`
  - Req:
    - id: ObjectId, required
  - Res:
    - Track matching input id
    - other: other error

## Playlist

### Read
- `http://localhost:3000/playlist/getlist`
  - Res:
    - Array of newest 10 playlists
    - other: other error

- `http://localhost:3000/playlist/getallplaylists`
  - Req:
    - username: String, required 
  - Res:
    - All playlists owned by given user
    - other: other error

### Create
- `http://localhost:3000/playlist/savelist`
  - Req:
    - name: String(1-30), required
    - description: String(max 500), optional
  - Res:
    - 200: Playlist created success
    - 400: Invalid or missing input
    - 403: User already owns 20 playlists
    - other: other error

- `http://localhost:3000/playlist/updateplaylist`
  - Header: token 
  - Req:
    - name: String(1-30), required
    - description: String(max 500), optional
    - public: Boolean, required
  - Res:
    - 200: Playlist info update success
    - 400: Invalid or missing input
    - 404: Playlist doesn't exist
    - 403: Current user has no access to modify this playlist
    - other: other error

- `http://localhost:3000/playlist/updatelist`
  - Header: token 
  - Req:
    - name: String(1-30), required
    - list: Array of tracks id
  - Res:
    - 200: Playlist update success
    - 400: Invalid or missing input
    - 404: Playlist doesn't exist
    - 403: Current user has no access to modify this playlist
    - other: other error

- `http://localhost:3000/playlist/addreview`
  - Header: token 
  - Req:
    - name: String(1-30), required
    - review: String(1-500), required
    - score: Integer(1-5)
  - Res:
    - 200: Playlist update success
    - 400: Invalid or missing input
    - 404: Playlist doesn't exist
    - other: other error

### Delete
- `http://localhost:3000/playlist/deletelist`
  - Header: token 
  - Req:
    - name: String(1-30), required
  - Res:
    - 200: Playlist deleted success
    - 400: Invalid or missing input
    - 404: Playlist doesn't exist
    - 403: Current user has no access to modify this playlist
    - other: other error