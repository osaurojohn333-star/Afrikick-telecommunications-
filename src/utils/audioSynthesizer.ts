/**
 * Web Audio API synthesizer for African Stadium Atmosphere (Vuvuzela harmonics, crowd roar, drum rhythm).
 * 100% synthesized in the browser without any external audio asset dependencies.
 */

class StadiumAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private masterGain: GainNode | null = null;
  private vuvuzelaOsc: OscillatorNode | null = null;
  private vuvuzelaGain: GainNode | null = null;
  private crowdNoiseNode: AudioNode | null = null;
  private drumInterval: number | null = null;

  public init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public start() {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    this.isPlaying = true;

    // 1. Crowd roar simulation using filtered pink/white noise
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      output[i] = (b0 + b1 + b2) * 0.12;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.2, this.ctx.currentTime);

    const crowdGain = this.ctx.createGain();
    crowdGain.gain.setValueAtTime(0.35, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(crowdGain);
    crowdGain.connect(this.masterGain);
    whiteNoise.start();
    this.crowdNoiseNode = whiteNoise;

    // 2. Vuvuzela drone sound (B-flat / 233Hz harmonic drone with slight vibrato)
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(233, this.ctx.currentTime); // ~B-flat 3

    // Vibrato LFO
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(4.5, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(4.2, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    lfo.start();

    const vuvuFilter = this.ctx.createBiquadFilter();
    vuvuFilter.type = 'bandpass';
    vuvuFilter.frequency.setValueAtTime(680, this.ctx.currentTime);
    vuvuFilter.Q.setValueAtTime(2.5, this.ctx.currentTime);

    const vuvuGain = this.ctx.createGain();
    vuvuGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

    osc.connect(vuvuFilter);
    vuvuFilter.connect(vuvuGain);
    vuvuGain.connect(this.masterGain);
    osc.start();

    this.vuvuzelaOsc = osc;
    this.vuvuzelaGain = vuvuGain;

    // 3. Rhythmic Stadium Drums beat
    this.startDrumPattern();
  }

  private startDrumPattern() {
    if (!this.ctx || !this.masterGain) return;
    const playKick = () => {
      if (!this.ctx || !this.masterGain || !this.isPlaying) return;
      const kickOsc = this.ctx.createOscillator();
      const kickGain = this.ctx.createGain();
      kickOsc.frequency.setValueAtTime(120, this.ctx.currentTime);
      kickOsc.frequency.exponentialRampToValueAtTime(35, this.ctx.currentTime + 0.14);
      kickGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      kickGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);
      kickOsc.connect(kickGain);
      kickGain.connect(this.masterGain);
      kickOsc.start();
      kickOsc.stop(this.ctx.currentTime + 0.19);
    };

    // Afrobeat cadence: pulse every 500ms
    this.drumInterval = window.setInterval(() => {
      playKick();
    }, 550);
  }

  public stop() {
    this.isPlaying = false;
    if (this.drumInterval) {
      clearInterval(this.drumInterval);
      this.drumInterval = null;
    }
    try {
      if (this.vuvuzelaOsc) {
        this.vuvuzelaOsc.stop();
        this.vuvuzelaOsc.disconnect();
        this.vuvuzelaOsc = null;
      }
      if (this.crowdNoiseNode && 'stop' in this.crowdNoiseNode) {
        (this.crowdNoiseNode as AudioBufferSourceNode).stop();
        this.crowdNoiseNode.disconnect();
        this.crowdNoiseNode = null;
      }
    } catch {
      // Ignore cleanup error
    }
  }

  public playWhistle() {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(2850, this.ctx.currentTime);

    // Whistle trill vibrato
    lfo.frequency.setValueAtTime(28, this.ctx.currentTime);
    lfoGain.gain.setValueAtTime(140, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.35, this.ctx.currentTime + 0.05);
    gain.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + 0.35);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.45);

    osc.connect(gain);
    gain.connect(this.masterGain);

    lfo.start();
    osc.start();
    osc.stop(this.ctx.currentTime + 0.46);
    lfo.stop(this.ctx.currentTime + 0.46);
  }

  public playGoalSurge() {
    this.init();
    this.playWhistle();
    if (!this.isPlaying) {
      this.start();
      setTimeout(() => {
        // Boost volume for celebration surge
        if (this.masterGain && this.ctx) {
          this.masterGain.gain.linearRampToValueAtTime(0.4, this.ctx.currentTime + 0.2);
          this.masterGain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + 3.5);
        }
      }, 50);
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const stadiumAudio = new StadiumAudioEngine();

