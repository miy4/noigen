import { useState, useEffect } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { SetPlaybackEnabled, SetMute, AdjustVolume } from "../wailsjs/go/main/App";

export default function NoiseMaker() {
    const VOLUME_MIN = -10;
    const VOLUME_MAX = 4;

    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState((VOLUME_MAX + VOLUME_MIN) / 2);

    const togglePlaying = () => {
        SetPlaybackEnabled(!isPlaying)
        setIsPlaying(!isPlaying);
    }

    const toggleMuted = () => {
        SetMute(!isMuted);
        setIsMuted(!isMuted);
    }

    const handleVolumeChange = (volume: number[]) => {
        const volumeValue = volume[0];
        AdjustVolume(volumeValue);
        setVolume(volumeValue);
        //setIsMuted(volumeValue === -10);
    }

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.code === 'Space') {
                togglePlaying();
            } else if (event.code === 'ArrowLeft') {
                handleVolumeChange([Math.max(VOLUME_MIN, volume - 0.2)]);
            } else if (event.code === 'ArrowRight') {
                handleVolumeChange([Math.min(VOLUME_MAX, volume + 0.2)]);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [togglePlaying, volume, handleVolumeChange]);

    return (
        <div className="bg-background text-foreground p-8 shadow-md max-w-md mx-auto">
            <div className="flex items-center space-x-4">
                <Button className="rounded-full w-12 h-12 flex items-center justify-center" onClick={togglePlaying}>
                    {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                </Button>
                <div className="flex items-center space-x-2 flex-grow">
                    <Button variant="ghost" size="sm" className="p-0" onClick={toggleMuted}>
                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                    <Slider className="flex-grow min-w-[150px]" value={[isMuted ? VOLUME_MIN : volume]} min={VOLUME_MIN} max={VOLUME_MAX} step={0.2} onValueChange={handleVolumeChange} />
                </div>
            </div>
        </div>
    )
}