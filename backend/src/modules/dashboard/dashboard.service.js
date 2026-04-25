import {
  getConversationTotalsRepository,
  getLeadTotalsRepository,
  getCommercialRequestTotalsRepository,
  getConversationStatusBreakdownRepository,
  getConversationIntentBreakdownRepository,
  getLatestConversationsRepository,
  getLatestLeadsRepository,
  getLatestCommercialRequestsRepository
} from "./dashboard.repository.js";

function arrayToObject(items, keyField, valueField) {
  return items.reduce((acc, item) => {
    acc[item[keyField]] = item[valueField];
    return acc;
  }, {});
}

function safePercentage(numerator, denominator) {
  if (!denominator || denominator === 0) {
    return 0;
  }

  return Number(((numerator / denominator) * 100).toFixed(2));
}

export async function getDashboardSummaryService() {
  const [
    totalConversations,
    totalLeads,
    totalCommercialRequests,
    statusBreakdownRows,
    intentBreakdownRows,
    latestConversations,
    latestLeads,
    latestCommercialRequests
  ] = await Promise.all([
    getConversationTotalsRepository(),
    getLeadTotalsRepository(),
    getCommercialRequestTotalsRepository(),
    getConversationStatusBreakdownRepository(),
    getConversationIntentBreakdownRepository(),
    getLatestConversationsRepository(5),
    getLatestLeadsRepository(5),
    getLatestCommercialRequestsRepository(5)
  ]);

  const byStatus = arrayToObject(statusBreakdownRows, "status", "total");
  const byIntent = arrayToObject(intentBreakdownRows, "detected_intent", "total");

  return {
    totals: {
      conversations: totalConversations,
      leads: totalLeads,
      commercial_requests: totalCommercialRequests
    },
    conversions: {
      conversation_to_lead_percentage: safePercentage(totalLeads, totalConversations),
      lead_to_request_percentage: safePercentage(totalCommercialRequests, totalLeads)
    },
    breakdowns: {
      conversations_by_status: {
        open: byStatus.open || 0,
        in_follow_up: byStatus.in_follow_up || 0,
        converted: byStatus.converted || 0,
        closed_no_conversion: byStatus.closed_no_conversion || 0
      },
      conversations_by_intent: {
        information: byIntent.information || 0,
        commercial_interest: byIntent.commercial_interest || 0,
        ready_to_advance: byIntent.ready_to_advance || 0,
        unknown: byIntent.unknown || 0
      }
    },
    recent_activity: {
      latest_conversations: latestConversations,
      latest_leads: latestLeads,
      latest_commercial_requests: latestCommercialRequests
    }
  };
}