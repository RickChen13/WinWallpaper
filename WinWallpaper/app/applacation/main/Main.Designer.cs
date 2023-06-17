using System;

namespace WinWallpaper.app.applacation.main
{
    partial class Main
    {
        /// <summary>
        /// 必需的设计器变量。
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// 清理所有正在使用的资源。
        /// </summary>
        /// <param name="disposing">如果应释放托管资源，为 true；否则为 false。</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows 窗体设计器生成的代码

        /// <summary>
        /// 设计器支持所需的方法 - 不要修改
        /// 使用代码编辑器修改此方法的内容。
        /// </summary>
        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            this.notifyIcon1 = new System.Windows.Forms.NotifyIcon(this.components);
            this.contextMenuStrip1 = new System.Windows.Forms.ContextMenuStrip(this.components);

            this.TSM_Title = new System.Windows.Forms.ToolStripMenuItem();
            this.TSM_AutoPlay = new System.Windows.Forms.ToolStripMenuItem();
            this.TSM_WsServer = new System.Windows.Forms.ToolStripMenuItem();
            this.TSM_Exit = new System.Windows.Forms.ToolStripMenuItem();

            this.MainWv = new Microsoft.Web.WebView2.WinForms.WebView2();

            ((System.ComponentModel.ISupportInitialize)(this.MainWv)).BeginInit();
            this.contextMenuStrip1.SuspendLayout();
            this.SuspendLayout();
            // 
            // notifyIcon1
            // 
            this.notifyIcon1.ContextMenuStrip = this.contextMenuStrip1;
            this.notifyIcon1.Text = "WinWallpaper";
            this.notifyIcon1.Visible = true;
            this.notifyIcon1.MouseDoubleClick += new System.Windows.Forms.MouseEventHandler(this.NotifyIcon1_MouseDoubleClick);

            // 
            // contextMenuStrip1
            // 
            this.contextMenuStrip1.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.TSM_Title,
            this.TSM_AutoPlay,
            this.TSM_WsServer,
            this.TSM_Exit});
            this.contextMenuStrip1.Name = "contextMenuStrip1";
            this.contextMenuStrip1.Size = new System.Drawing.Size(169, 312);
            this.contextMenuStrip1.Opening += new System.ComponentModel.CancelEventHandler(this.ContextMenuStrip1_Opening);
            this.contextMenuStrip1.Closing += new System.Windows.Forms.ToolStripDropDownClosingEventHandler(this.ContextMenuStrip1_Closing);
            // 
            // TSM_Title
            // 
            this.TSM_Title.Enabled = false;
            this.TSM_Title.Name = "TSM_Title";
            this.TSM_Title.Size = new System.Drawing.Size(168, 22);
            this.TSM_Title.Text = "WinWallpaper";
            // 
            // TSM_AutoPlay
            // 
            this.TSM_AutoPlay.Name = "TSM_AutoPlay";
            this.TSM_AutoPlay.Size = new System.Drawing.Size(168, 22);
            this.TSM_AutoPlay.Text = "启动后自动播放";
            this.TSM_AutoPlay.Click += new System.EventHandler(this.TSM_AutoPlay_Click);
            // 
            // TSM_WsServer
            // 
            this.TSM_WsServer.Name = "TSM_WsServer";
            this.TSM_WsServer.Size = new System.Drawing.Size(168, 22);
            this.TSM_WsServer.Text = "订阅WebSocket事件";
            this.TSM_WsServer.Click += new System.EventHandler(this.TSM_WsServer_Click);
            // 
            // TSM_Exit
            // 
            this.TSM_Exit.Name = "TSM_Exit";
            this.TSM_Exit.Size = new System.Drawing.Size(168, 22);
            this.TSM_Exit.Text = "退出";
            this.TSM_Exit.Click += new System.EventHandler(this.TSM_Exit_Click);
            // 
            // MainWv
            // 
            this.MainWv.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom)
            | System.Windows.Forms.AnchorStyles.Left)
            | System.Windows.Forms.AnchorStyles.Right)));
            this.MainWv.CreationProperties = null;
            this.MainWv.DefaultBackgroundColor = System.Drawing.Color.White;
            this.MainWv.Location = new System.Drawing.Point(0, 0);
            this.MainWv.Name = "MainWv";
            this.MainWv.Size = new System.Drawing.Size(1250, 650);
            this.MainWv.TabIndex = 0;
            this.MainWv.ZoomFactor = 1D;
            this.MainWv.Source = new Uri(System.AppContext.BaseDirectory + @"\\runtimes\\appView\\index.html", System.UriKind.Absolute);
            //this.MainWv.Source = new Uri("http://localhost:8081");
            this.MainWv.CoreWebView2InitializationCompleted += new System.EventHandler<Microsoft.Web.WebView2.Core.CoreWebView2InitializationCompletedEventArgs>(this.MainWv_CoreWebView2InitializationCompleted);
            // 
            // Main
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 12F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(1250, 650);
            this.Controls.Add(this.MainWv);
            this.Name = "Main";
            this.Text = "WinWallpaper";
            this.Load += new System.EventHandler(this.Main_Load);
            this.FormClosing += new System.Windows.Forms.FormClosingEventHandler(this.MainForm_Closing);

            this.contextMenuStrip1.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)(this.MainWv)).EndInit();
            this.ResumeLayout(false);

        }

        #endregion

        /// <summary>
        /// title
        /// </summary>
        private System.Windows.Forms.NotifyIcon notifyIcon1 { get; set; }
        private System.Windows.Forms.ContextMenuStrip contextMenuStrip1 { get; set; }

        /// <summary>
        /// title
        /// </summary>
        private System.Windows.Forms.ToolStripMenuItem TSM_Title { get; set; }
        
        /// <summary>
        /// 自动播放
        /// </summary>
        private System.Windows.Forms.ToolStripMenuItem TSM_AutoPlay { get; set; }

        /// <summary>
        /// websocket服务
        /// </summary>
        private System.Windows.Forms.ToolStripMenuItem TSM_WsServer { get; set; }

        /// <summary>
        /// 退出程序
        /// </summary>
        private System.Windows.Forms.ToolStripMenuItem TSM_Exit { get; set; }

        /// <summary>
        /// 主程序WebView
        /// </summary>
        private Microsoft.Web.WebView2.WinForms.WebView2 MainWv { get; set; }
    }
}

