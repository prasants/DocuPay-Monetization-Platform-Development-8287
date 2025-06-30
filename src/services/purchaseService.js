import { supabase } from '../lib/supabase';

export const purchaseService = {
  // Create a purchase record
  async createPurchase(purchaseData) {
    try {
      const { data, error } = await supabase
        .from('purchase_docupay2024')
        .insert([purchaseData])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creating purchase:', error);
      return { success: false, error: error.message };
    }
  },

  // Update purchase status
  async updatePurchaseStatus(purchaseId, status, stripePaymentId = null) {
    try {
      const updates = { status };
      if (stripePaymentId) {
        updates.stripe_payment_id = stripePaymentId;
      }

      const { data, error } = await supabase
        .from('purchase_docupay2024')
        .update(updates)
        .eq('id', purchaseId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error updating purchase status:', error);
      return { success: false, error: error.message };
    }
  },

  // Create document access record
  async createDocumentAccess(accessData) {
    try {
      const { data, error } = await supabase
        .from('document_access_docupay2024')
        .insert([accessData])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creating document access:', error);
      return { success: false, error: error.message };
    }
  },

  // Check if customer already purchased document
  async checkExistingPurchase(documentId, customerEmail) {
    try {
      const { data, error } = await supabase
        .from('purchase_docupay2024')
        .select('id, status')
        .eq('document_id', documentId)
        .eq('customer_email', customerEmail)
        .eq('status', 'completed')
        .limit(1);

      if (error) throw error;
      return { 
        success: true, 
        hasPurchased: data && data.length > 0,
        purchase: data?.[0] 
      };
    } catch (error) {
      console.error('Error checking existing purchase:', error);
      return { success: false, error: error.message };
    }
  },

  // Get user's purchase history (for creators)
  async getUserPurchases() {
    try {
      const { data, error } = await supabase
        .from('purchase_docupay2024')
        .select(`
          *,
          document_docupay2024(title, price)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error fetching user purchases:', error);
      return { success: false, error: error.message };
    }
  }
};