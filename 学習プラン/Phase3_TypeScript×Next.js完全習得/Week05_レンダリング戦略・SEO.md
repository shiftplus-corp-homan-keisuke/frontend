# Week 5: レンダリング戦略・SEO

## 📅 学習期間・目標

**期間**: Week 5（7日間）
**総学習時間**: 12時間（平日1.5時間、週末3時間）
**学習スタイル**: レンダリング戦略50% + SEO最適化30% + Metadata API 20%

### 🎯 Week 5 到達目標

- [ ] SSG/SSR/ISRの理解と適切な使い分け
- [ ] Metadata APIによるSEO最適化
- [ ] 動的OGP・構造化データの実装
- [ ] サイトマップ・robots.txtの自動生成
- [ ] Core Web Vitalsの理解と改善

## 📚 理論学習内容

### Day 29-31: レンダリング戦略

#### 🎯 SSG/SSR/ISRの実装

```typescript
// 1. Static Site Generation (SSG)
// app/blog/[slug]/page.tsx
interface BlogPostProps {
  params: { slug: string };
}

// 静的パラメータの生成
export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// 静的メタデータの生成
export async function generateMetadata({ params }: BlogPostProps): Promise<Metadata> {
  const post = await getBlogPost(params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags.join(', '),
    authors: [{ name: post.author.name }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      images: [
        {
          url: post.featuredImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.featuredImage],
    },
  };
}

// 静的ページの生成
export default async function BlogPostPage({ params }: BlogPostProps) {
  const post = await getBlogPost(params.slug);
  
  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
        <div className="flex items-center text-gray-600 mb-4">
          <time dateTime={post.publishedAt}>
            {new Date(post.publishedAt).toLocaleDateString('ja-JP')}
          </time>
          <span className="mx-2">•</span>
          <span>{post.author.name}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>
      
      <div className="prose prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </article>
  );
}

// データ取得関数（ビルド時に実行）
async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(`${process.env.API_URL}/posts/${slug}`, {
      next: { revalidate: false }, // 静的生成
    });
    
    if (!response.ok) {
      return null;
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

// 2. Server-Side Rendering (SSR)
// app/search/page.tsx
interface SearchPageProps {
  searchParams: { q?: string; page?: string; category?: string };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';
  const page = parseInt(searchParams.page || '1');
  const category = searchParams.category || '';

  // サーバーサイドでデータ取得（リクエスト毎に実行）
  const searchResults = await searchPosts({
    query,
    page,
    category,
  });

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {query ? `"${query}"の検索結果` : '記事検索'}
        </h1>
        {query && (
          <p className="text-gray-600 mt-2">
            {searchResults.total}件の記事が見つかりました
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <SearchFilters currentCategory={category} />
        </aside>
        
        <main className="lg:col-span-3">
          <SearchForm initialQuery={query} />
          <SearchResults results={searchResults.posts} />
          <Pagination
            currentPage={page}
            totalPages={searchResults.totalPages}
            baseUrl="/search"
            searchParams={searchParams}
          />
        </main>
      </div>
    </div>
  );
}

// SSR用データ取得（キャッシュなし）
async function searchPosts(params: {
  query: string;
  page: number;
  category: string;
}): Promise<SearchResults> {
  const searchParams = new URLSearchParams({
    q: params.query,
    page: params.page.toString(),
    category: params.category,
  });

  const response = await fetch(
    `${process.env.API_URL}/search?${searchParams}`,
    {
      cache: 'no-store', // SSR（キャッシュなし）
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch search results');
  }

  return response.json();
}

// 3. Incremental Static Regeneration (ISR)
// app/products/[id]/page.tsx
interface ProductPageProps {
  params: { id: string };
}

export async function generateStaticParams() {
  // 人気商品のみ事前生成
  const popularProducts = await getPopularProducts();
  
  return popularProducts.map((product) => ({
    id: product.id,
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(params.id);
  
  if (!product) {
    return { title: 'Product Not Found' };
  }

  return {
    title: `${product.name} | DataFlow Store`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images.map((img) => ({
        url: img.url,
        width: img.width,
        height: img.height,
        alt: product.name,
      })),
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.id);
  
  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <ProductImageGallery images={product.images} />
        </div>
        
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {product.name}
          </h1>
          <p className="text-2xl font-semibold text-blue-600 mb-6">
            ¥{product.price.toLocaleString()}
          </p>
          <div className="prose prose-lg mb-8">
            <p>{product.description}</p>
          </div>
          
          <ProductActions product={product} />
        </div>
      </div>
      
      <div className="mt-12">
        <ProductReviews productId={product.id} />
      </div>
    </div>
  );
}

// ISR用データ取得（定期的に再生成）
async function getProduct(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`${process.env.API_URL}/products/${id}`, {
      next: { revalidate: 3600 }, // 1時間毎に再生成
    });
    
    if (!response.ok) {
      return null;
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}
```

### Day 32-33: Metadata API・SEO最適化

#### 🎯 動的メタデータとSEO

```typescript
// 4. 高度なMetadata設定
// app/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL('https://dataflow.example.com'),
  title: {
    template: '%s | DataFlow',
    default: 'DataFlow - Modern SaaS Dashboard',
  },
  description: 'DataFlowは現代的なSaaSダッシュボードアプリケーションです。',
  keywords: ['SaaS', 'Dashboard', 'Analytics', 'Next.js', 'TypeScript'],
  authors: [{ name: 'DataFlow Team' }],
  creator: 'DataFlow Team',
  publisher: 'DataFlow Inc.',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://dataflow.example.com',
    siteName: 'DataFlow',
    title: 'DataFlow - Modern SaaS Dashboard',
    description: 'DataFlowは現代的なSaaSダッシュボードアプリケーションです。',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'DataFlow Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@dataflow',
    creator: '@dataflow',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
  },
};

// 5. 構造化データの実装
// components/structured-data.tsx
interface StructuredDataProps {
  type: 'Article' | 'Product' | 'Organization' | 'WebSite';
  data: any;
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const generateStructuredData = () => {
    const baseData = {
      '@context': 'https://schema.org',
      '@type': type,
    };

    switch (type) {
      case 'Article':
        return {
          ...baseData,
          headline: data.title,
          description: data.description,
          image: data.image,
          author: {
            '@type': 'Person',
            name: data.author.name,
          },
          publisher: {
            '@type': 'Organization',
            name: 'DataFlow',
            logo: {
              '@type': 'ImageObject',
              url: 'https://dataflow.example.com/logo.png',
            },
          },
          datePublished: data.publishedAt,
          dateModified: data.updatedAt,
        };

      case 'Product':
        return {
          ...baseData,
          name: data.name,
          description: data.description,
          image: data.images,
          offers: {
            '@type': 'Offer',
            price: data.price,
            priceCurrency: 'JPY',
            availability: data.inStock ? 'InStock' : 'OutOfStock',
          },
          aggregateRating: data.rating && {
            '@type': 'AggregateRating',
            ratingValue: data.rating.average,
            reviewCount: data.rating.count,
          },
        };

      case 'Organization':
        return {
          ...baseData,
          name: data.name,
          url: data.url,
          logo: data.logo,
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: data.phone,
            contactType: 'customer service',
          },
          sameAs: data.socialLinks,
        };

      case 'WebSite':
        return {
          ...baseData,
          name: data.name,
          url: data.url,
          potentialAction: {
            '@type': 'SearchAction',
            target: `${data.url}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        };

      default:
        return baseData;
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(generateStructuredData()),
      }}
    />
  );
}

// 6. サイトマップ生成
// app/sitemap.ts
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://dataflow.example.com';
  
  // 静的ページ
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ];

  // 動的ページ（ブログ記事）
  const posts = await getAllBlogPosts();
  const blogPages = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // 動的ページ（商品）
  const products = await getAllProducts();
  const productPages = products.map((product) => ({
    url: `${baseUrl}/products/${product.id}`,
    lastModified: new Date(product.updatedAt),
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...blogPages, ...productPages];
}

// 7. robots.txt生成
// app/robots.ts
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://dataflow.example.com';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/private/',
          '/_next/',
          '/dashboard/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/private/',
          '/dashboard/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
```

### Day 34-35: パフォーマンス最適化

#### 🎯 Core Web Vitals改善

```typescript
// 8. 画像最適化
// components/optimized-image.tsx
import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
  sizes?: string;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        sizes={sizes}
        className={`
          duration-700 ease-in-out
          ${isLoading ? 'scale-110 blur-2xl grayscale' : 'scale-100 blur-0 grayscale-0'}
        `}
        onLoad={() => setIsLoading(false)}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
      />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
}

// 9. Web Vitals測定
// components/web-vitals.tsx
'use client';

import { useEffect } from 'react';
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export function WebVitals() {
  useEffect(() => {
    getCLS((metric) => {
      console.log('CLS:', metric);
      // アナリティクスに送信
      sendToAnalytics('CLS', metric.value);
    });

    getFID((metric) => {
      console.log('FID:', metric);
      sendToAnalytics('FID', metric.value);
    });

    getFCP((metric) => {
      console.log('FCP:', metric);
      sendToAnalytics('FCP', metric.value);
    });

    getLCP((metric) => {
      console.log('LCP:', metric);
      sendToAnalytics('LCP', metric.value);
    });

    getTTFB((metric) => {
      console.log('TTFB:', metric);
      sendToAnalytics('TTFB', metric.value);
    });
  }, []);

  return null;
}

function sendToAnalytics(name: string, value: number) {
  // Google Analytics 4に送信
  if (typeof gtag !== 'undefined') {
    gtag('event', name, {
      value: Math.round(name === 'CLS' ? value * 1000 : value),
      event_category: 'Web Vitals',
      non_interaction: true,
    });
  }

  // カスタムアナリティクスに送信
  fetch('/api/analytics/web-vitals', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      value,
      url: window.location.href,
      timestamp: Date.now(),
    }),
  }).catch(console.error);
}
```

## 🎯 実践演習

### 演習 5-1: レンダリング戦略実装 🔶

**目標**: 適切なレンダリング戦略の選択と実装

```typescript
// 実装するページタイプ
interface RenderingStrategies {
  staticPages: {
    '/': 'SSG - ランディングページ';
    '/about': 'SSG - 会社情報';
    '/blog/[slug]': 'SSG - ブログ記事';
  };
  
  dynamicPages: {
    '/search': 'SSR - 検索結果';
    '/dashboard': 'SSR - ダッシュボード';
    '/user/[id]': 'SSR - ユーザープロフィール';
  };
  
  hybridPages: {
    '/products/[id]': 'ISR - 商品詳細';
    '/categories/[slug]': 'ISR - カテゴリページ';
  };
}
```

### 演習 5-2: SEO完全最適化 🔥

**目標**: 包括的なSEO対策の実装

```typescript
// 実装するSEO機能
interface SEOFeatures {
  metadata: '動的メタデータ生成';
  structuredData: '構造化データ実装';
  sitemap: '自動サイトマップ生成';
  robots: 'robots.txt最適化';
  ogp: 'OGP・Twitter Card対応';
  webVitals: 'Core Web Vitals測定・改善';
}
```

## 📊 Week 5 評価基準

### 理解度チェックリスト

#### レンダリング戦略 (40%)
- [ ] SSG/SSR/ISRの違いを理解している
- [ ] 適切な戦略を選択できる
- [ ] generateStaticParamsを実装できる
- [ ] キャッシュ戦略を最適化できる

#### SEO最適化 (35%)
- [ ] Metadata APIを活用できる
- [ ] 構造化データを実装できる
- [ ] サイトマップを自動生成できる
- [ ] OGP・Twitter Cardを最適化できる

#### パフォーマンス (15%)
- [ ] Core Web Vitalsを理解している
- [ ] 画像最適化を実装できる
- [ ] パフォーマンス測定を実装できる
- [ ] 最適化施策を実行できる

#### 実践応用 (10%)
- [ ] 実際のSEO効果を測定できる
- [ ] ユーザー体験を向上できる
- [ ] アクセシビリティを考慮できる
- [ ] 継続的な改善ができる

### 成果物チェックリスト

- [ ] **レンダリング戦略**: SSG/SSR/ISRの適切な実装
- [ ] **SEO最適化**: 完全なSEO対策実装
- [ ] **構造化データ**: Schema.org対応
- [ ] **パフォーマンス**: Core Web Vitals改善

## 🔄 Week 6 への準備

### 次週学習内容の予習

```typescript
// Week 6で学習するパフォーマンス・監視の基礎概念

// 1. バンドル分析
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

// 2. 監視・ログ
import { withSentryConfig } from '@sentry/nextjs';

// 3. A/Bテスト
import { useFeatureFlag } from '@/hooks/use-feature-flag';
```

---

**📌 重要**: Week 5ではNext.jsの強力なレンダリング機能とSEO最適化を学習し、検索エンジンに最適化されたアプリケーションを構築します。適切な戦略選択により、パフォーマンスとSEOの両立を実現できます。