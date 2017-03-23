// Type definitions for WebRTC
// Project: http://dev.w3.org/2011/webrtc/
// Definitions by: Ken Smith <https://github.com/smithkl42/>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

// Taken from http://dev.w3.org/2011/webrtc/editor/getusermedia.html
// version: W3C Editor's Draft 29 June 2015

interface ConstrainBooleanParameters {
    exact?: boolean;
    ideal?: boolean;
}

interface NumberRange {
    max?: number;
    min?: number;
}

interface ConstrainNumberRange extends NumberRange {
    exact?: number;
    ideal?: number;
}

interface ConstrainStringParameters {
    exact?: string | string[];
    ideal?: string | string[];
}

interface MediaStreamConstraints {
    video?: boolean | MediaTrackConstraints;
    audio?: boolean | MediaTrackConstraints;
}

declare namespace W3C {
    type LongRange = NumberRange;
    type DoubleRange = NumberRange;
    type ConstrainBoolean = boolean | ConstrainBooleanParameters;
    type ConstrainNumber = number | ConstrainNumberRange;
    type ConstrainLong = ConstrainNumber;
    type ConstrainDouble = ConstrainNumber;
    type ConstrainString = string | string[] | ConstrainStringParameters;
}

interface MediaTrackConstraints extends MediaTrackConstraintSet {
    advanced?: MediaTrackConstraintSet[];
}

interface MediaTrackConstraintSet {
    width?: W3C.ConstrainLong;
    height?: W3C.ConstrainLong;
    aspectRatio?: W3C.ConstrainDouble;
    frameRate?: W3C.ConstrainDouble;
    facingMode?: W3C.ConstrainString;
    volume?: W3C.ConstrainDouble;
    sampleRate?: W3C.ConstrainLong;
    sampleSize?: W3C.ConstrainLong;
    echoCancellation?: W3C.ConstrainBoolean;
    latency?: W3C.ConstrainDouble;
    deviceId?: W3C.ConstrainString;
    groupId?: W3C.ConstrainString;
}

interface MediaTrackSupportedConstraints {
    width?: boolean;
    height?: boolean;
    aspectRatio?: boolean;
    frameRate?: boolean;
    facingMode?: boolean;
    volume?: boolean;
    sampleRate?: boolean;
    sampleSize?: boolean;
    echoCancellation?: boolean;
    latency?: boolean;
    deviceId?: boolean;
    groupId?: boolean;
}

interface MediaStream extends EventTarget {


    clone(): MediaStream;
    stop(): void;

    getAudioTracks(): MediaStreamTrack[];
    getVideoTracks(): MediaStreamTrack[];
    getTracks(): MediaStreamTrack[];

    getTrackById(trackId: string): MediaStreamTrack;

    addTrack(track: MediaStreamTrack): void;
    removeTrack(track: MediaStreamTrack): void;
}

interface MediaStreamTrackEvent extends Event {
}

declare enum MediaStreamTrackState {
    "live",
    "ended"
}

interface MediaStreamTrack extends EventTarget {
    enabled: boolean;


    clone(): MediaStreamTrack;

    stop(): void;

    getCapabilities(): MediaTrackCapabilities;
    getConstraints(): MediaTrackConstraints;
    getSettings(): MediaTrackSettings;
    applyConstraints(constraints: MediaTrackConstraints): Promise<void>;
}

interface MediaTrackCapabilities {
    latency: number | W3C.DoubleRange;
}

interface MediaTrackSettings {
    latency: number;
}

interface MediaStreamError {
}

interface NavigatorGetUserMedia {
    (constraints: MediaStreamConstraints,
        successCallback: (stream: MediaStream) => void,
        errorCallback: (error: MediaStreamError) => void): void;
}

declare var getUserMedia: NavigatorGetUserMedia;

interface Navigator {
    getUserMedia: NavigatorGetUserMedia;

    webkitGetUserMedia: NavigatorGetUserMedia;

    mozGetUserMedia: NavigatorGetUserMedia;

    msGetUserMedia: NavigatorGetUserMedia;

    mediaDevices: MediaDevices;
}

interface MediaDevices {
    getSupportedConstraints(): MediaTrackSupportedConstraints;

    getUserMedia(constraints: MediaStreamConstraints): Promise<MediaStream>;
    enumerateDevices(): Promise<MediaDeviceInfo[]>;
}

interface MediaDeviceInfo {
}