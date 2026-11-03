# إعداد قاعدة بيانات التقييمات (Cloudflare D1)

## 1) إنشاء القواعد (مرة واحدة)
    npx wrangler login
    npx wrangler d1 create rahal-pro-db-staging
    npx wrangler d1 create rahal-pro-db
انسخي كل `database_id` ظاهر إلى `wrangler.jsonc` (الأول للـ staging والثاني تحت env.production).

## 2) إنشاء الجدول
    # محليًا للتجربة
    npx wrangler d1 migrations apply rahal-pro-db-staging --local
    # على الإنترنت (staging ثم production)
    npx wrangler d1 migrations apply rahal-pro-db-staging --remote
    npx wrangler d1 migrations apply rahal-pro-db --remote --env production

## 3) إدارة التقييمات (كل تقييم جديد يبدأ "pending" ولا يظهر قبل موافقتك)
    # عرض الجديد
    npx wrangler d1 execute rahal-pro-db --remote --env production --command "SELECT id,name,rating,comment FROM reviews WHERE status='pending'"
    # قبول
    npx wrangler d1 execute rahal-pro-db --remote --env production --command "UPDATE reviews SET status='approved' WHERE id=1"
    # رفض
    npx wrangler d1 execute rahal-pro-db --remote --env production --command "UPDATE reviews SET status='rejected' WHERE id=1"
