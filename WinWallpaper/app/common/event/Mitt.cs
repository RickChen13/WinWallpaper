namespace WinWallpaper.app.common.@event
{
    public delegate void EventHandler<T>(T data);
    public class Mitt<T>
    {
        private EventHandler<T> eventHandler;

        /// <summary>
        /// 事件发布
        /// </summary>
        /// <param name="data"></param>
        public void Call(T data)
        {
            eventHandler?.Invoke(data);
        }

        /// <summary>
        /// 事件订阅
        /// </summary>
        /// <param name="handler"></param>
        public void Add(EventHandler<T> handler)
        {
            eventHandler += handler;
        }

        /// <summary>
        /// 取消订阅
        /// </summary>
        /// <param name="handler"></param>
        public void Cut(EventHandler<T> handler)
        {
            eventHandler -= handler;
        }
    }
}
