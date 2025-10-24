import { NextRequest, NextResponse } from 'next/server'

/**
 * Keep-Alive API 端點
 *
 * 此端點由 Vercel Cron Jobs 每日觸發，用於保持 Supabase 專案活躍狀態
 *
 * 工作原理：
 * - 直接訪問 Supabase REST API root 端點
 * - 無需建立任何資料庫表
 * - 任何 API 請求都會觸發資料庫活動
 *
 * 安全性：
 * - 支援可選的 CRON_SECRET 驗證
 * - 使用 Authorization header 進行驗證
 *
 * 響應格式：
 * - 成功: { success: true, timestamp: string, message: string }
 * - 失敗: { success: false, timestamp: string, error: string }
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now()

  // 1. 驗證 CRON_SECRET (如果設定了環境變數)
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret) {
    const authHeader = request.headers.get('authorization')

    if (!authHeader || authHeader !== `Bearer ${cronSecret}`) {
      console.warn('Unauthorized keep-alive attempt:', {
        timestamp: new Date().toISOString(),
        ip: request.ip || 'unknown',
      })

      return NextResponse.json(
        {
          success: false,
          timestamp: new Date().toISOString(),
          error: 'Unauthorized',
        },
        { status: 401 }
      )
    }
  }

  try {
    // 2. 取得 Supabase 環境變數
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables')
    }

    // 3. 直接訪問 Supabase REST API root 端點
    // 這個端點無需任何表即可訪問，會返回 API 資訊
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Supabase API returned ${response.status}: ${response.statusText}`)
    }

    // 4. 計算執行時間
    const executionTime = Date.now() - startTime

    // 5. 記錄成功執行
    console.log('Keep-alive ping successful:', {
      timestamp: new Date().toISOString(),
      executionTime: `${executionTime}ms`,
      supabaseUrl: supabaseUrl,
    })

    // 6. 返回成功響應
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      message: 'Keep-alive ping successful - Supabase project is active',
      executionTime: `${executionTime}ms`,
    })

  } catch (error) {
    // 7. 錯誤處理
    const executionTime = Date.now() - startTime
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    console.error('Keep-alive error:', {
      timestamp: new Date().toISOString(),
      error: errorMessage,
      executionTime: `${executionTime}ms`,
    })

    return NextResponse.json(
      {
        success: false,
        timestamp: new Date().toISOString(),
        error: errorMessage,
        executionTime: `${executionTime}ms`,
      },
      { status: 500 }
    )
  }
}

/**
 * 健康檢查端點
 * 用於手動測試 API 是否正常運作
 */
export async function HEAD(request: NextRequest) {
  return new NextResponse(null, { status: 200 })
}

