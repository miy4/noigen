package main

import (
	"context"
	"math/rand/v2"
	"time"

	"github.com/gopxl/beep/v2"
	"github.com/gopxl/beep/v2/effects"
	"github.com/gopxl/beep/v2/speaker"
)

// BrownNoise is a simple noise generator that generates brown noise.
type BrownNoise struct {
	alpha    float64
	previous float64
}

// Stream generates brown noise. It implements the beep.Streamer interface.
func (bn *BrownNoise) Stream(samples [][2]float64) (n int, ok bool) {
	for i := range samples {
		current := bn.alpha*(2*rand.Float64()-1.0) + (1-bn.alpha)*bn.previous
		bn.previous = current

		samples[i][0] = current
		samples[i][1] = current
	}
	return len(samples), true
}

// Err returns an error if the streamer has an error.
func (bn *BrownNoise) Err() error {
	return nil
}

// App struct
type App struct {
	ctx    context.Context
	ctrl   *beep.Ctrl
	volume *effects.Volume
}

// NewApp creates a new App application struct
func NewApp() *App {
	sr := beep.SampleRate(44100)
	speaker.Init(sr, sr.N(time.Second/10))
	ctrl := &beep.Ctrl{Streamer: &BrownNoise{alpha: 0.01}, Paused: true}
	volume := &effects.Volume{Streamer: ctrl, Base: 2, Volume: -3}
	speaker.Play(volume)

	return &App{
		ctrl:   ctrl,
		volume: volume,
	}
}

// SetPlaybackEnabled sets the playback state. If enable is true, playback is enabled, otherwise it is paused.
func (a *App) SetPlaybackEnabled(enable bool) {
	speaker.Lock()
	a.ctrl.Paused = !enable
	speaker.Unlock()
}

// SetMute sets the mute state. If mute is true, the audio is muted, otherwise it is not muted.
func (a *App) SetMute(mute bool) {
	speaker.Lock()
	a.volume.Silent = mute
	speaker.Unlock()
}

// AdjustVolume sets the volume of the audio.
func (a *App) AdjustVolume(volume float64) {
	speaker.Lock()
	a.volume.Volume = volume
	speaker.Unlock()
}

// startup is called at application startup
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// domReady is called after front-end resources have been loaded
func (a App) domReady(ctx context.Context) {}

// beforeClose is called when the application is about to quit,
// either by clicking the window close button or calling runtime.Quit.
// Returning true will cause the application to continue, false will continue shutdown as normal.
func (a *App) beforeClose(ctx context.Context) (prevent bool) {
	return false
}

// shutdown is called at application termination
func (a *App) shutdown(ctx context.Context) {
	speaker.Close()
}
