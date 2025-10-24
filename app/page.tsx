export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold mb-4">
          Supabase Keep-Alive ⏰
        </h1>
        <p className="text-lg text-gray-600 mb-2">
          自动保持您的 Supabase 免费项目活跃状态
        </p>
        <p className="text-sm text-gray-500 mb-8">
          零数据库操作 · 零维护成本 · 完全自动化
        </p>

        <div className="space-y-4 text-left">
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold">🎯 工作原理</h3>
            <p className="text-sm text-gray-600">
              直接访问 Supabase REST API，触发数据库活动
            </p>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-semibold">⏰ 执行频率</h3>
            <p className="text-sm text-gray-600">每天 UTC 8:00 自动执行</p>
          </div>

          <div className="border-l-4 border-purple-500 pl-4">
            <h3 className="font-semibold">🚀 API 端点</h3>
            <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
              /api/keep-alive
            </code>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t space-y-4">
          <div className="flex justify-center gap-4">
            <a
              href="/api/keep-alive"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              测试 API
            </a>
            <a
              href="https://github.com/chun1617/supabase-keep-alive"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 transition"
            >
              GitHub →
            </a>
          </div>
          <p className="text-xs text-gray-500">
            部署后无需任何操作，项目将自动保持活跃 🎉
          </p>
        </div>
      </div>
    </main>
  )
}

