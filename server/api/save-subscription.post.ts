let subscriptions: any[] = [];

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  subscriptions.push(body);
  console.log("🔔 Subscription salva:", body);
  return { success: true };
});

// exporta lista de inscritos
export { subscriptions };
