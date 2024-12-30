import cv2
import mediapipe as mp
import numpy as np

# Initialize Mediapipe Face Mesh
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(refine_landmarks=True)

def calculate_brightness(face_roi):
    """Calculate average brightness of the face region and check for overexposure."""
    gray = cv2.cvtColor(face_roi, cv2.COLOR_BGR2GRAY)
    mean_brightness = np.mean(gray)
    overexposed_pixels = np.sum(gray > 200)  # Pixels with brightness greater than 200
    total_pixels = gray.size

    return mean_brightness, overexposed_pixels / total_pixels

def detect_eye_contact(face_landmarks, frame_width, frame_height):
    """Check if the eyes are looking straight."""
    # Landmarks for the eyes (mediapipe uses specific indices for eye regions)
    left_eye = [362, 385, 386, 387, 388, 390, 249, 263]
    right_eye = [33, 160, 161, 246, 7, 173, 133, 144]

    # Get coordinates for left and right eye landmarks
    left_eye_coords = np.array([(face_landmarks.landmark[i].x * frame_width,
                                 face_landmarks.landmark[i].y * frame_height) for i in left_eye])
    right_eye_coords = np.array([(face_landmarks.landmark[i].x * frame_width,
                                  face_landmarks.landmark[i].y * frame_height) for i in right_eye])

    # Estimate gaze by computing the horizontal distance between the centers of both eyes
    left_gaze = np.mean(left_eye_coords[:, 0])
    right_gaze = np.mean(right_eye_coords[:, 0])

    dist = abs(left_gaze - right_gaze) 
    eye_distance = np.mean([np.linalg.norm(left_eye_coords[i] - left_eye_coords[i-1]) for i in range(1, len(left_eye))])
    eye_distance += np.mean([np.linalg.norm(right_eye_coords[i] - right_eye_coords[i-1]) for i in range(1, len(right_eye))])
    eye_distance /= 2
    

    # Check if gaze is centered (distance is large compared to eye distance)
    if dist/eye_distance > 9: # Adjust multiplier as needed
        return True
    return False

# OpenCV Video Capture
cap = cv2.VideoCapture(0)

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    # Flip frame for a mirror-like effect
    frame = cv2.flip(frame, 1)
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # Detect face landmarks
    results = face_mesh.process(rgb_frame)

    if results.multi_face_landmarks:
        for face_landmarks in results.multi_face_landmarks:
            # Extract face region and calculate brightness
            h, w, _ = frame.shape
            face_roi = frame[int(h * 0.2):int(h * 0.8), int(w * 0.2):int(w * 0.8)]  # Adjust face ROI
            mean_brightness, overexposed_ratio = calculate_brightness(face_roi)

            # Detect eye contact
            eye_contact = detect_eye_contact(face_landmarks, frame_width=w, frame_height=h)

            # Display results on the frame
            lighting_status = "Well Lit" if mean_brightness > 100 and overexposed_ratio < 0.1 else "Poor Lighting"
            eye_contact_status = "GOOD" if eye_contact else "BAD"

            cv2.putText(frame, f"Lighting: {lighting_status}", (30, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
            cv2.putText(frame, f"Eye Contact: {eye_contact_status}", (30, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)

    # Display the frame
    cv2.imshow('Eye Contact and Lighting Detection', frame)

    # Exit on pressing 'q'
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
