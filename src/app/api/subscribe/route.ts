import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const { email, author_id } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: "Missing Supabase configuration" }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Upsert subscriber (email)
    const { data: subscriberDataResult, error: subscriberError } = await supabase
      .from("subscribers")
      .select("id")
      .eq("email", email)
      .single();

    let subscriberData = subscriberDataResult;

    if (subscriberError || !subscriberData) {
      const { data: insertData, error: insertError } = await supabase
        .from("subscribers")
        .insert({ email })
        .select("id")
        .single();
      
      if (insertError) {
        return NextResponse.json({ error: "Error saving subscriber" }, { status: 500 });
      }
      subscriberData = insertData;
    }

    const subscriber_id = subscriberData.id;

    // 2. Insert subscription
    const { error: subscriptionError } = await supabase
      .from("subscriptions")
      .insert({
        subscriber_id,
        author_id: author_id || null, // null means "All Authors"
      });

    // If there is an error but it's a unique constraint violation, we can just ignore it
    // because they are already subscribed.
    if (subscriptionError && subscriptionError.code !== '23505') {
      return NextResponse.json({ error: "Error saving subscription" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Subscribed successfully!" });
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
