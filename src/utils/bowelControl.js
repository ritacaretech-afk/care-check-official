// 排便コントロール（個別指示）

export const DEFAULT_BOWEL_PLAN = {
  day3: "3日以上排便なし。下剤調整を確認し、看護師へ報告してください。",
  day4: "4日以上排便なし。下剤調整後の効果確認を行い、看護師へ報告してください。",
  day5: "5日以上排便なし。腹部症状・疼痛・嘔吐・食事量を確認し、医師・訪問看護への相談を検討してください。",
};

export function getBowelPlan(data, room) {
  return {
    ...DEFAULT_BOWEL_PLAN,
    ...(data?.residents?.[room]?.bowelPlan || {}),
  };
}

export function getBowelInstruction(data, room, noBowelDays) {
  const plan = getBowelPlan(data, room);

  if (noBowelDays >= 5) return plan.day5;
  if (noBowelDays === 4) return plan.day4;
  if (noBowelDays === 3) return plan.day3;

  return "";
}

export function isBowelAlertTarget(noBowelDays, effectiveBowelCount) {
  return noBowelDays >= 3 && effectiveBowelCount < 1;
}
