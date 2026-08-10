'use client';

import { Button } from '@kod-raido/ui';
import { useSettingsStore } from '@/lib/settings-store';
import { playSfx } from '@/lib/sfx';

function VolumeSlider({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}) {
  return (
    <label className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-raido-white">{label}</span>
        <span className="text-raido-mist">{value}%</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-raido-steel accent-raido-red disabled:cursor-not-allowed disabled:opacity-40"
      />
    </label>
  );
}

export default function SettingsPage() {
  const {
    musicVolume,
    sfxVolume,
    voiceVolume,
    lowDataMode,
    setMusicVolume,
    setSfxVolume,
    setVoiceVolume,
    setLowDataMode,
  } = useSettingsStore();

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Настройки</h1>
        <p className="mt-1 text-sm text-raido-mist">
          Звук и режим экономии трафика хранятся на этом устройстве.
        </p>
      </div>

      <section className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-raido-graphite p-5">
        <VolumeSlider label="Музыка" value={musicVolume} onChange={setMusicVolume} />
        <VolumeSlider
          label="Звуковые эффекты"
          value={sfxVolume}
          onChange={setSfxVolume}
          disabled={lowDataMode}
        />
        <VolumeSlider label="Голос" value={voiceVolume} onChange={setVoiceVolume} />

        <Button
          variant="secondary"
          onClick={() => playSfx('card-play')}
          disabled={lowDataMode || sfxVolume === 0}
          className="self-start"
        >
          🔊 Проверить звук
        </Button>
      </section>

      <section className="rounded-2xl border border-white/10 bg-raido-graphite p-5">
        <label className="flex items-center justify-between gap-4">
          <span>
            <span className="block font-medium text-raido-white">Режим экономии трафика</span>
            <span className="mt-1 block text-xs text-raido-mist">
              Отключает звуковые эффекты и анимации редких карт — меньше нагрузки на устройство и
              трафик.
            </span>
          </span>
          <input
            type="checkbox"
            checked={lowDataMode}
            onChange={(e) => setLowDataMode(e.target.checked)}
            className="h-6 w-11 shrink-0 cursor-pointer appearance-none rounded-full bg-raido-steel outline-none transition-colors checked:bg-raido-red relative before:absolute before:left-0.5 before:top-0.5 before:h-5 before:w-5 before:rounded-full before:bg-raido-white before:transition-transform checked:before:translate-x-5"
          />
        </label>
      </section>
    </div>
  );
}
