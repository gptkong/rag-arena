import { Button, Select } from 'antd'
import {
  StepBackwardOutlined,
  StepForwardOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons'
import { formatTimePoint, formatDuration } from './utils'
import { useCitationAudio } from '@/hooks/arena/useCitationAudio'

const { Option } = Select

interface CitationAudioPlayerProps {
  file: string
  totalDuration: number
  audioState: ReturnType<typeof useCitationAudio>
}

export function CitationAudioPlayer({ file, totalDuration, audioState }: CitationAudioPlayerProps) {
  const {
    audioRef,
    isPlaying,
    setIsPlaying,
    playbackRate,
    currentTime,
    setCurrentTime,
    togglePlay,
    seek,
    stepBackward,
    stepForward,
    changePlaybackRate,
  } = audioState

  // 生成模拟波形数据（0轴在中间，正负振幅，确保对称）
  const generateWaveform = () => {
    const points = 200
    return Array.from({ length: points }, () => {
      // 生成 -1 到 1 之间的值，模拟音频振幅
      // 使用更真实的波形模式，确保上下对称
      const base = Math.random() * 0.8 + 0.2 // 0.2 到 1.0
      const sign = Math.random() > 0.5 ? 1 : -1
      return base * sign
    })
  }

  const waveformData = totalDuration > 0 ? generateWaveform() : []

  return (
    <div className="px-6 py-4 border-b border-slate-200 bg-white">
      {/* 音频元素（隐藏） */}
      <audio
        ref={audioRef}
        src={file}
        onTimeUpdate={(e) => {
          const audio = e.currentTarget
          setCurrentTime(audio.currentTime)
        }}
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* 波形图 - 0轴在中间的对称波形（高度缩小一半） */}
      <div className="mb-3">
        <div className="h-16 bg-slate-50 rounded border border-slate-200 p-1.5 relative overflow-x-auto">
          {/* 0轴参考线 */}
          <div className="absolute left-0 right-0 top-1/2 h-px bg-slate-300 z-0" />
          
          {/* 波形容器 */}
          <div className="relative h-full flex items-center gap-0.5">
            {waveformData.map((amplitude, index) => {
              const time = (index / waveformData.length) * totalDuration
              const isActive = currentTime >= time && currentTime < (index + 1) / waveformData.length * totalDuration
              const absAmplitude = Math.abs(amplitude)
              // 将振幅转换为高度百分比（0-50%，因为上下各占一半），高度缩小一半
              const heightPercent = Math.max(5, absAmplitude * 25)
              
              return (
                <div
                  key={index}
                  className="relative flex-1 min-w-[2px] cursor-pointer group"
                  onClick={() => seek(time)}
                  title={`跳转到 ${formatTimePoint(time)}`}
                  style={{ height: '100%', position: 'relative' }}
                >
                  {/* 上方波形（正振幅） */}
                  <div
                    className="absolute left-0 right-0 rounded transition-all duration-200 hover:opacity-80"
                    style={{
                      bottom: '50%',
                      height: `${heightPercent}%`,
                      backgroundColor: isActive ? '#14b8a6' : '#5eead4',
                      minHeight: '1px',
                      display: amplitude >= 0 ? 'block' : 'none',
                    }}
                  />
                  {/* 下方波形（负振幅） */}
                  <div
                    className="absolute left-0 right-0 rounded transition-all duration-200 hover:opacity-80"
                    style={{
                      top: '50%',
                      height: `${heightPercent}%`,
                      backgroundColor: isActive ? '#14b8a6' : '#5eead4',
                      minHeight: '1px',
                      display: amplitude < 0 ? 'block' : 'none',
                    }}
                  />
                </div>
              )
            })}
          </div>
        </div>
        <div className="flex items-center justify-between mt-1.5 text-xs text-slate-500">
          <span>{formatTimePoint(currentTime)}</span>
          <span>{formatDuration(totalDuration)}</span>
        </div>
      </div>

      {/* 播放控制 - 紧凑布局 */}
      <div className="flex items-center gap-2">
        <Button
          type="text"
          icon={<StepBackwardOutlined />}
          onClick={stepBackward}
          className="!w-8 !h-8 !rounded !p-0"
          size="small"
        />
        <Button
          type="primary"
          icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
          onClick={togglePlay}
          className="!w-10 !h-10 !rounded !bg-gradient-to-r !from-teal-500 !to-emerald-500 !border-0 !p-0"
          size="small"
        />
        <Button
          type="text"
          icon={<StepForwardOutlined />}
          onClick={stepForward}
          className="!w-8 !h-8 !rounded !p-0"
          size="small"
        />
        <div className="flex items-center gap-1.5 ml-2">
          <ThunderboltOutlined className="text-slate-400 text-xs" />
          <Select
            value={playbackRate}
            onChange={changePlaybackRate}
            size="small"
            className="!w-16 !text-xs"
            bordered={false}
          >
            <Option value={0.5}>0.5x</Option>
            <Option value={0.75}>0.75x</Option>
            <Option value={1}>1x</Option>
            <Option value={1.25}>1.25x</Option>
            <Option value={1.5}>1.5x</Option>
            <Option value={2}>2x</Option>
          </Select>
        </div>
      </div>
    </div>
  )
}
