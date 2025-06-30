export const mockUsers = [
  {
    id: 'user_1',
    email: 'creator@example.com',
    name: 'Sarah Johnson',
    picture: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
    googleId: 'google_123',
    createdAt: '2024-01-15T10:00:00Z',
    totalEarnings: 2456.50,
    totalSales: 47
  }
];

export const mockDocuments = [
  {
    id: 'doc_1',
    title: 'Complete Guide to React Hooks',
    description: 'A comprehensive guide covering all React Hooks with practical examples and best practices. Perfect for developers looking to master modern React development.',
    price: 29.99,
    creatorId: 'user_1',
    googleDocId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
    googleDocUrl: 'https://docs.google.com/document/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit',
    previewContent: 'React Hooks revolutionized how we write React components. This guide covers useState, useEffect, useContext, and custom hooks with real-world examples...',
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop',
    tags: ['React', 'JavaScript', 'Web Development', 'Hooks'],
    createdAt: '2024-01-20T14:30:00Z',
    updatedAt: '2024-01-25T09:15:00Z',
    isActive: true,
    sales: 23,
    views: 156,
    revenue: 689.77,
    purchasers: [
      { email: 'customer1@example.com', purchasedAt: '2024-01-21T10:00:00Z' },
      { email: 'customer2@example.com', purchasedAt: '2024-01-22T15:30:00Z' }
    ]
  },
  {
    id: 'doc_2',
    title: 'Advanced TypeScript Patterns',
    description: 'Deep dive into advanced TypeScript patterns, generics, and type manipulation techniques for building robust applications.',
    price: 39.99,
    creatorId: 'user_1',
    googleDocId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
    googleDocUrl: 'https://docs.google.com/document/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit',
    previewContent: 'TypeScript\'s type system is incredibly powerful. Learn advanced patterns like conditional types, mapped types, and template literal types...',
    coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=300&fit=crop',
    tags: ['TypeScript', 'JavaScript', 'Programming', 'Types'],
    createdAt: '2024-01-18T11:20:00Z',
    updatedAt: '2024-01-24T16:45:00Z',
    isActive: true,
    sales: 15,
    views: 89,
    revenue: 599.85,
    purchasers: [
      { email: 'dev1@example.com', purchasedAt: '2024-01-19T09:00:00Z' }
    ]
  },
  {
    id: 'doc_3',
    title: 'API Design Best Practices',
    description: 'Learn how to design RESTful APIs that are scalable, maintainable, and developer-friendly. Includes real-world examples and case studies.',
    price: 24.99,
    creatorId: 'user_1',
    googleDocId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
    googleDocUrl: 'https://docs.google.com/document/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit',
    previewContent: 'Well-designed APIs are the backbone of modern applications. This guide covers REST principles, authentication, versioning, and documentation...',
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop',
    tags: ['API', 'REST', 'Backend', 'Web Development'],
    createdAt: '2024-01-16T08:45:00Z',
    updatedAt: '2024-01-23T12:30:00Z',
    isActive: true,
    sales: 9,
    views: 67,
    revenue: 224.91,
    purchasers: []
  }
];

export const mockSalesData = [
  { date: '2024-01-15', sales: 2, revenue: 59.98 },
  { date: '2024-01-16', sales: 1, revenue: 24.99 },
  { date: '2024-01-17', sales: 3, revenue: 89.97 },
  { date: '2024-01-18', sales: 4, revenue: 129.95 },
  { date: '2024-01-19', sales: 2, revenue: 69.98 },
  { date: '2024-01-20', sales: 5, revenue: 164.94 },
  { date: '2024-01-21', sales: 3, revenue: 89.97 },
  { date: '2024-01-22', sales: 6, revenue: 194.93 },
  { date: '2024-01-23', sales: 4, revenue: 129.95 },
  { date: '2024-01-24', sales: 7, revenue: 224.92 },
  { date: '2024-01-25', sales: 5, revenue: 164.94 }
];