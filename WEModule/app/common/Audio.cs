using NAudio.Dsp;
using NAudio.Wave;
using System;
using System.Linq;

namespace WEModule.app.common
{
    public class Audio
    {
        private WasapiLoopbackCapture Capture { get; set; }
        private int BitsPerSample { get; set; }
        private int SampleRate { get; set; }
        private int ChannelCount { get; set; }
        private double FrequencyPerIndex { get; set; }
        private float[] Samples { get; set; }           // 保存的样本
        private double[] DftData { get; set; }       // 
        private double[] Line { get; set; }
        private object SamplesLock { get; set; } = new object();
        private object DftDataLock { get; set; } = new object();
        private double CurveFrequencyEnd { get; set; } = 2500d;
        //初始值交换变量
        private double[] Temp { get; set; }

        public Audio()
        {
            Capture = new WasapiLoopbackCapture();
            Temp = new double[106];
            for (int i = 0; i < 106; i++)
            {
                Temp[i] = 0;
            }
            Line = Temp;
            BitsPerSample = Capture.WaveFormat.BitsPerSample;
            SampleRate = Capture.WaveFormat.SampleRate;
            ChannelCount = Capture.WaveFormat.Channels;
        }

        public void StartListener()
        {
            Capture.DataAvailable += (sender, e) =>
            {
                if (e.BytesRecorded != 0)
                {
                    Line = GetLineData(e);
                }
                else
                {
                    Line = Temp;
                }
            };
            Capture.StartRecording();
        }

        public void StopListener()
        {
            Capture.StopRecording();
        }

        public double[] GetData()
        {
            return Line;
        }

        private double[] GetLineData(WaveInEventArgs e)
        {
            int bytesPerSample = BitsPerSample / 8;
            lock (SamplesLock)
                Samples = Enumerable
                              .Range(0, e.BytesRecorded / 4)
                              .Select(i => BitConverter.ToSingle(e.Buffer, i * 4)).ToArray();   // 获取采样
            float[][] chanelSamples;
            lock (SamplesLock)
                chanelSamples = Enumerable
                    .Range(0, ChannelCount)
                    .Select(i => Enumerable
                        .Range(0, Samples.Length / ChannelCount)
                        .Select(j => Samples[i + j * ChannelCount])
                        .ToArray())
                    .ToArray();

            float[] chanelAverageSamples = Enumerable
               .Range(0, chanelSamples[0].Length)
               .Select(i => Enumerable
                   .Range(0, ChannelCount)
                   .Select(j => chanelSamples[j][i])
                   .Average())
               .ToArray();

            float[] sampleSrc = chanelAverageSamples;
            int log = (int)Math.Floor(Math.Log(sampleSrc.Length, 2));
            float[] filledSamples = new float[(int)Math.Pow(2, log)];
            Array.Copy(sampleSrc, filledSamples, Math.Min(sampleSrc.Length, filledSamples.Length));   // 填充数据
            Complex[] complexSrc = filledSamples.Select((v, i) => new Complex() { X = v }).ToArray();
            FastFourierTransform.FFT(false, log, complexSrc);     // 进行傅里叶变换
            double[] res = complexSrc.Select(v => Math.Sqrt(v.X * v.X + v.Y * v.Y)).ToArray();    // 取得结果
            double[] reresult = res;                            // 取一半

            FrequencyPerIndex = (double)SampleRate / filledSamples.Length;
            UpdateDftData(reresult, 0.8, 0.5);

            int hz2500index = (int)(CurveFrequencyEnd / FrequencyPerIndex);
            return DftData?.Take(hz2500index).ToArray();
        }

        // <summary>
        /// 平滑的更新 DftData
        /// </summary>
        /// <param name="newData"></param>
        /// <param name="upParam"></param>
        /// <param name="downParam"></param>
        /// <returns></returns>
        private double[] UpdateDftData(double[] newData, double upParam = 1, double downParam = 1)
        {
            if (DftData == null || DftData.Length == 0)
                return DftData = newData.Select(v => v * upParam).ToArray();
            lock (DftDataLock)
            {
                try
                {
                    return DftData = newData.Select((v, i) =>
                    {
                        double lastData = GetCurvePoint(DftData, (double)i / newData.Length);
                        double incre = v - lastData;
                        return lastData + incre * (incre > 0 ? upParam : downParam);
                    }).ToArray();
                }
                catch (IndexOutOfRangeException)
                {
                    return null;
                }
            }
        }

        /// <summary>
        /// 从 double 中平滑的获取一个值
        /// 索引以百分比的形式指定, 基本原理时调用 GetCurvePoint
        /// </summary>
        /// <param name="sequence"></param>
        /// <param name="percent"></param>
        /// <returns></returns>
        double GetCurvePoint(double[] sequence, double percent)
        {
            return IndexCurvePoint(sequence, percent * sequence.Length);
        }

        /// <summary>
        /// 从 double 中平滑的取得一个值
        /// 例如 curve[0] = 0, curve[1] = 100, 那么通过此方法访问 curve[0.5], 可得到 50
        /// </summary>
        /// <param name="curve"></param>
        /// <param name="index"></param>
        /// <returns></returns>
        double IndexCurvePoint(double[] curve, double index)
        {
            int
                floor = (int)Math.Min(Math.Floor(index), curve.Length - 1),
                ceiling = (int)Math.Min(Math.Ceiling(index), curve.Length - 1);
            if (floor == ceiling)
                return curve[floor];
            double
                left = curve[floor],
                right = curve[ceiling];
            return left + (right - left) * (index - floor);
        }

    }
}
