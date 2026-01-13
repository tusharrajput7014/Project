import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  PhoneOff,
  MessageSquare
} from 'lucide-react';
import { 
  doc, 
  setDoc, 
  onSnapshot, 
  collection, 
  addDoc,
  deleteDoc,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';

// WebRTC configuration with free STUN servers
const rtcConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ]
};

const VideoCall = () => {
  const { bookingId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [isCallActive, setIsCallActive] = useState(false);
  const [connectionState, setConnectionState] = useState('Initializing...');
  const [remoteUserConnected, setRemoteUserConnected] = useState(false);
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const streamRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const unsubscribeOfferRef = useRef(null);
  const unsubscribeAnswerRef = useRef(null);
  const unsubscribeIceCandidatesRef = useRef(null);

  useEffect(() => {
    let interval;

    // Initialize local media stream
    const startLocalStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        
        streamRef.current = stream;
        setConnectionState('Local stream ready');
        return stream;
      } catch (error) {
        console.error('Error accessing media devices:', error);
        setConnectionState('Failed to access camera/microphone');
        alert('Unable to access camera/microphone. Please check permissions.');
        throw error;
      }
    };

    // Create peer connection
    const createPeerConnection = (stream) => {
      const peerConnection = new RTCPeerConnection(rtcConfiguration);
      peerConnectionRef.current = peerConnection;

      // Add local stream tracks to peer connection
      stream.getTracks().forEach(track => {
        peerConnection.addTrack(track, stream);
      });

      // Handle incoming remote stream
      peerConnection.ontrack = (event) => {
        console.log('Received remote track', event);
        if (remoteVideoRef.current && event.streams[0]) {
          remoteVideoRef.current.srcObject = event.streams[0];
          setRemoteUserConnected(true);
          setIsCallActive(true);
          setConnectionState('Connected');
        }
      };

      // Handle ICE candidates
      peerConnection.onicecandidate = async (event) => {
        if (event.candidate) {
          console.log('New ICE candidate', event.candidate);
          try {
            await addDoc(collection(db, 'calls', bookingId, 'candidates'), {
              candidate: event.candidate.toJSON(),
              userId: user.id,
              timestamp: serverTimestamp()
            });
          } catch (error) {
            console.error('Error adding ICE candidate:', error);
          }
        }
      };

      // Monitor connection state
      peerConnection.onconnectionstatechange = () => {
        console.log('Connection state:', peerConnection.connectionState);
        switch (peerConnection.connectionState) {
          case 'connected':
            setConnectionState('Connected');
            setIsCallActive(true);
            break;
          case 'disconnected':
            setConnectionState('Disconnected');
            break;
          case 'failed':
            setConnectionState('Connection failed');
            break;
          case 'closed':
            setConnectionState('Connection closed');
            break;
          default:
            setConnectionState(peerConnection.connectionState);
        }
      };

      peerConnection.oniceconnectionstatechange = () => {
        console.log('ICE connection state:', peerConnection.iceConnectionState);
        if (peerConnection.iceConnectionState === 'connected') {
          setConnectionState('Connected');
        }
      };

      return peerConnection;
    };

    // Create offer (caller initiates)
    const createOffer = async (peerConnection) => {
      try {
        setConnectionState('Creating offer...');
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        await setDoc(doc(db, 'calls', bookingId), {
          offer: {
            type: offer.type,
            sdp: offer.sdp
          },
          callerId: user.id,
          callerName: user.name,
          timestamp: serverTimestamp(),
          status: 'calling'
        });

        setConnectionState('Waiting for answer...');
        console.log('Offer created and sent');
      } catch (error) {
        console.error('Error creating offer:', error);
        setConnectionState('Failed to create offer');
      }
    };

    // Listen for answer
    const listenForAnswer = (peerConnection) => {
      const callDoc = doc(db, 'calls', bookingId);
      const unsubscribe = onSnapshot(callDoc, async (snapshot) => {
        const data = snapshot.data();
        if (data?.answer && !peerConnection.currentRemoteDescription) {
          console.log('Received answer');
          const answerDescription = new RTCSessionDescription(data.answer);
          await peerConnection.setRemoteDescription(answerDescription);
          setConnectionState('Connecting...');
        }
      });
      return unsubscribe;
    };

    // Answer the call (receiver responds)
    const answerCall = async (peerConnection, offer) => {
      try {
        setConnectionState('Answering call...');
        const offerDescription = new RTCSessionDescription(offer);
        await peerConnection.setRemoteDescription(offerDescription);

        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        await updateDoc(doc(db, 'calls', bookingId), {
          answer: {
            type: answer.type,
            sdp: answer.sdp
          },
          answeredBy: user.id,
          answeredAt: serverTimestamp(),
          status: 'active'
        });

        setConnectionState('Connecting...');
        console.log('Answer sent');
      } catch (error) {
        console.error('Error answering call:', error);
        setConnectionState('Failed to answer call');
      }
    };

    // Listen for offer
    const listenForOffer = (peerConnection) => {
      const callDoc = doc(db, 'calls', bookingId);
      const unsubscribe = onSnapshot(callDoc, async (snapshot) => {
        const data = snapshot.data();
        if (data?.offer && !peerConnection.currentRemoteDescription && data.callerId !== user.id) {
          console.log('Received offer from', data.callerName);
          await answerCall(peerConnection, data.offer);
        }
      });
      return unsubscribe;
    };

    // Listen for ICE candidates
    const listenForIceCandidates = (peerConnection) => {
      const candidatesCollection = collection(db, 'calls', bookingId, 'candidates');
      const unsubscribe = onSnapshot(candidatesCollection, (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          if (change.type === 'added') {
            const data = change.doc.data();
            if (data.userId !== user.id) {
              try {
                const candidate = new RTCIceCandidate(data.candidate);
                await peerConnection.addIceCandidate(candidate);
                console.log('Added ICE candidate');
              } catch (error) {
                console.error('Error adding ICE candidate:', error);
              }
            }
          }
        });
      });
      return unsubscribe;
    };

    // Initialize call
    const init = async () => {
      try {
        const stream = await startLocalStream();
        const peerConnection = createPeerConnection(stream);

        // Check if there's already an offer (joining existing call)
        const callDoc = doc(db, 'calls', bookingId);
        const snapshot = await new Promise((resolve) => {
          const unsubscribe = onSnapshot(callDoc, (snap) => {
            unsubscribe();
            resolve(snap);
          });
        });

        const callData = snapshot.data();

        if (callData?.offer && callData.callerId !== user.id) {
          // Join existing call
          console.log('Joining existing call');
          unsubscribeOfferRef.current = listenForOffer(peerConnection);
        } else {
          // Create new call
          console.log('Creating new call');
          await createOffer(peerConnection);
          unsubscribeAnswerRef.current = listenForAnswer(peerConnection);
        }

        // Listen for ICE candidates
        unsubscribeIceCandidatesRef.current = listenForIceCandidates(peerConnection);

      } catch (error) {
        console.error('Error initializing call:', error);
      }
    };

    init();

    // Timer for call duration
    interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => {
      // Cleanup
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }

      if (unsubscribeOfferRef.current) unsubscribeOfferRef.current();
      if (unsubscribeAnswerRef.current) unsubscribeAnswerRef.current();
      if (unsubscribeIceCandidatesRef.current) unsubscribeIceCandidatesRef.current();

      deleteDoc(doc(db, 'calls', bookingId)).catch(console.error);
      
      clearInterval(interval);
    };
  }, [bookingId, user.id, user.name]);

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioOn(audioTrack.enabled);
      }
    }
  };

  const endCall = async () => {
    // Stop local stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }

    // Clean up Firestore
    try {
      await deleteDoc(doc(db, 'calls', bookingId));
    } catch (error) {
      console.error('Error cleaning up:', error);
    }

    navigate(`/chat/${bookingId}`);
  };

  const openChat = () => {
    navigate(`/chat/${bookingId}`);
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerInfo}>
          <h2 style={styles.headerTitle}>Video Call</h2>
          <p style={styles.callDuration}>
            {isCallActive ? formatDuration(callDuration) : 'Connecting...'}
          </p>
        </div>
      </div>

      {/* Video Area */}
      <div style={styles.videoContainer}>
        {/* Remote Video (Main) */}
        <div style={styles.remoteVideo}>
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            style={styles.video}
          />
          {!remoteUserConnected && (
            <div style={styles.remoteVideoPlaceholder}>
              <div style={styles.avatarLarge}>
                {user?.userType === 'provider' ? '👤' : '👔'}
              </div>
              <p style={styles.placeholderText}>
                {user?.userType === 'provider' ? 'Waiting for user...' : 'Waiting for provider...'}
              </p>
              <p style={styles.placeholderSubtext}>
                {connectionState}
              </p>
            </div>
          )}
        </div>

        {/* Local Video (Picture-in-Picture) */}
        <div style={styles.localVideo}>
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            style={styles.video}
          />
          {!isVideoOn && (
            <div style={styles.localVideoOff}>
              <VideoOff size={24} color="white" />
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div style={styles.controls}>
        <div style={styles.controlsInner}>
          <button
            onClick={toggleAudio}
            style={{
              ...styles.controlButton,
              ...(isAudioOn ? styles.controlButtonActive : styles.controlButtonInactive)
            }}
          >
            {isAudioOn ? <Mic size={24} /> : <MicOff size={24} />}
          </button>

          <button
            onClick={toggleVideo}
            style={{
              ...styles.controlButton,
              ...(isVideoOn ? styles.controlButtonActive : styles.controlButtonInactive)
            }}
          >
            {isVideoOn ? <Video size={24} /> : <VideoOff size={24} />}
          </button>

          <button
            onClick={openChat}
            style={styles.controlButton}
          >
            <MessageSquare size={24} />
          </button>

          <button
            onClick={endCall}
            style={styles.endCallButton}
          >
            <PhoneOff size={24} />
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div style={styles.infoBanner}>
        <p style={styles.infoText}>
          🎥 WebRTC-powered video calling with Firebase signaling • {connectionState}
          {remoteUserConnected && ' • Remote user connected'}
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: '#1a202c'
  },
  header: {
    background: 'rgba(0, 0, 0, 0.5)',
    padding: '16px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10
  },
  headerInfo: {
    color: 'white'
  },
  headerTitle: {
    fontSize: '18px',
    fontWeight: '700',
    margin: 0
  },
  callDuration: {
    fontSize: '14px',
    opacity: 0.8,
    margin: '4px 0 0 0'
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
    background: '#000'
  },
  remoteVideo: {
    width: '100%',
    height: '100%',
    position: 'relative'
  },
  remoteVideoPlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  avatarLarge: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '60px',
    marginBottom: '20px'
  },
  placeholderText: {
    color: 'white',
    fontSize: '20px',
    fontWeight: '600',
    margin: '0 0 12px 0'
  },
  placeholderSubtext: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '14px',
    maxWidth: '400px',
    textAlign: 'center',
    padding: '0 20px'
  },
  localVideo: {
    position: 'absolute',
    bottom: '120px',
    right: '24px',
    width: '240px',
    height: '180px',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
    background: '#2d3748',
    zIndex: 5
  },
  localVideoOff: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#2d3748'
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '24px',
    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
    zIndex: 10
  },
  controlsInner: {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    maxWidth: '500px',
    margin: '0 auto'
  },
  controlButton: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    background: 'rgba(255, 255, 255, 0.2)',
    color: 'white'
  },
  controlButtonActive: {
    background: 'rgba(255, 255, 255, 0.2)',
    color: 'white'
  },
  controlButtonInactive: {
    background: '#e53e3e',
    color: 'white'
  },
  endCallButton: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#e53e3e',
    color: 'white',
    transition: 'all 0.2s'
  },
  infoBanner: {
    position: 'absolute',
    top: '80px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(102, 126, 234, 0.9)',
    padding: '12px 24px',
    borderRadius: '8px',
    maxWidth: '600px',
    zIndex: 10
  },
  infoText: {
    color: 'white',
    fontSize: '13px',
    margin: 0,
    textAlign: 'center',
    lineHeight: '1.5'
  }
};

export default VideoCall;
