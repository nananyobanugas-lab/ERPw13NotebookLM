import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * PROMPT TEMPLATE 1: Schema Design
 */
export const generateSchemaDesign = async (context: string) => {
  const modelId = "gemini-2.5-flash"; // Good balance for code generation
  
  const prompt = `
  Role: Senior Software Architect & Accounting Professor.
  Task: We are designing a new microservice named 'billing-claims-service' for a Hospital ERP.
  Context provided by user: "${context}"
  
  Based on hospital accounting standards (COA) and typical insurance claim patterns, generate a JSON schema and Microservice Definition.
  
  Requirements:
  1. Core Entities: Patient_Master, Admission_Record, Medical_Service_Item, Insurance_Policy, Claim_Transaction.
  2. Define relationships, specifically how Medical Service Items (clinical costs) map to AR and GL.
  3. Suggest 3 OpenAPI endpoints (e.g., /api/v1/claims/process).
  4. Identify 2 data fields vulnerable to fraud for ML anomaly detection.

  Output format: JSON only. Structure the JSON to have keys: "erd_structure", "relationships", "api_endpoints", "fraud_detection_fields".
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Schema Gen Error:", error);
    throw error;
  }
};

/**
 * PROMPT TEMPLATE 2: Automation (Invoice Extraction)
 */
export const extractInvoiceData = async (base64Image: string, mimeType: string) => {
  const modelId = "gemini-2.5-flash";

  const prompt = `
  Role: AI Auditor & Data Extraction Bot.
  Task: Process this medical invoice image (High-Cost Pharmaceutical/Equipment).
  
  Extract the following key data:
  1. Vendor Name
  2. Invoice ID
  3. Total Amount (Gross)
  4. Tax Amount (PPN/VAT)
  5. Main Item Description
  
  Logic:
  - Convert extracted data into a valid JSON payload for the 'accounting-core' microservice.
  - Determine GL Account Debit (e.g., 'Inventory: Pharmaceuticals' or 'Expenses: Medical Supplies') based on description.
  - Determine GL Account Credit (e.g., 'Accounts Payable').
  - Provide a Confidence Score (0-100).
  - If Confidence < 90, set 'requiresReview' to true.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          { inlineData: { mimeType, data: base64Image } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            vendorName: { type: Type.STRING },
            invoiceId: { type: Type.STRING },
            totalAmount: { type: Type.NUMBER },
            taxAmount: { type: Type.NUMBER },
            currency: { type: Type.STRING },
            itemDescription: { type: Type.STRING },
            glDebitAccount: { type: Type.STRING },
            glCreditAccount: { type: Type.STRING },
            confidenceScore: { type: Type.NUMBER },
            requiresReview: { type: Type.BOOLEAN },
          },
          required: [
            "vendorName",
            "invoiceId",
            "totalAmount",
            "taxAmount",
            "currency",
            "itemDescription",
            "glDebitAccount",
            "glCreditAccount",
            "confidenceScore",
            "requiresReview"
          ],
        }
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    throw error;
  }
};

/**
 * PROMPT TEMPLATE 3: Strategic Reporting
 */
export const generateStrategicMemo = async (financialData: string) => {
  const modelId = "gemini-2.5-flash"; // Using flash for speed, could upgrade to pro for deeper reasoning

  const prompt = `
  Role: Assistant CFO of a Hospital Group.
  Task: Write a strategic memo (max 400 words) to the Director of Operations.
  
  Input Data (JSON):
  ${financialData}

  Requirements:
  1. Predictive Analysis: Predict critical inventory needs (e.g., Disposable Sterilization Kits) for next 90 days assuming 15% OR utilization increase.
  2. Inefficiency Identification: Highlight 2 inefficient processes based on the data (e.g., Admission to Billing gap).
  3. Actionable Recommendations: 3 specific actions to optimize clinical staff and procurement to reduce Cost of Revenue by 5%.

  Tone: Professional, Concise, Strategic, Data-Driven.
  Format: Markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Reporting Error:", error);
    throw error;
  }
};