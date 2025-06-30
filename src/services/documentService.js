import { supabase } from '../lib/supabase';

export const documentService = {
  // Create a new document
  async createDocument(documentData) {
    try {
      const { data, error } = await supabase
        .from('document_docupay2024')
        .insert([{
          ...documentData,
          user_id: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creating document:', error);
      return { success: false, error: error.message };
    }
  },

  // Get user's documents
  async getUserDocuments() {
    try {
      const { data, error } = await supabase
        .from('document_docupay2024')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error fetching user documents:', error);
      return { success: false, error: error.message };
    }
  },

  // Get document by share_id (public access)
  async getDocumentByShareId(shareId) {
    try {
      const { data, error } = await supabase
        .from('document_docupay2024')
        .select(`
          *,
          user_profile_docupay2024!inner(display_name, avatar_url)
        `)
        .eq('share_id', shareId)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching document:', error);
      return { success: false, error: error.message };
    }
  },

  // Get document by ID (owner access)
  async getDocumentById(documentId) {
    try {
      const { data, error } = await supabase
        .from('document_docupay2024')
        .select('*')
        .eq('id', documentId)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching document:', error);
      return { success: false, error: error.message };
    }
  },

  // Update document
  async updateDocument(documentId, updates) {
    try {
      const { data, error } = await supabase
        .from('document_docupay2024')
        .update(updates)
        .eq('id', documentId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error updating document:', error);
      return { success: false, error: error.message };
    }
  },

  // Delete document
  async deleteDocument(documentId) {
    try {
      const { error } = await supabase
        .from('document_docupay2024')
        .delete()
        .eq('id', documentId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting document:', error);
      return { success: false, error: error.message };
    }
  },

  // Increment document views
  async incrementViews(documentId) {
    try {
      const { error } = await supabase
        .rpc('increment_document_views', { doc_id: documentId });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error incrementing views:', error);
      return { success: false, error: error.message };
    }
  },

  // Get user analytics
  async getUserAnalytics() {
    try {
      // Get documents with their stats
      const { data: documents, error: docsError } = await supabase
        .from('document_docupay2024')
        .select('id, title, price, sales, views, revenue, created_at');

      if (docsError) throw docsError;

      // Get recent sales data
      const { data: purchases, error: purchasesError } = await supabase
        .from('purchase_docupay2024')
        .select('amount, creator_earnings, created_at')
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(30);

      if (purchasesError) throw purchasesError;

      return { 
        success: true, 
        data: { 
          documents: documents || [], 
          purchases: purchases || [] 
        } 
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return { success: false, error: error.message };
    }
  }
};