import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface GuardianEmailRequest {
  userMessage: string;
  timestamp: string;
}

const GUARDIAN_EMAIL = "gayathriumapathy430@gmail.com";

const handler = async (req: Request): Promise<Response> => {
  console.log("send-guardian-email function called");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    const { userMessage, timestamp }: GuardianEmailRequest = await req.json();
    
    console.log("Sending guardian email for distress message detected at:", timestamp);

    const emailResponse = await resend.emails.send({
      from: "FEMCARE Alert <onboarding@resend.dev>",
      to: [GUARDIAN_EMAIL],
      subject: "🚨 URGENT: FEMCARE Wellness Alert - Please Check In",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #fff5f7; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(236, 72, 153, 0.1); }
            .header { background: linear-gradient(135deg, #ec4899, #f472b6); color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; }
            .alert-badge { background-color: #fef2f2; border: 2px solid #ef4444; color: #dc2626; padding: 15px 20px; margin: 20px; border-radius: 12px; }
            .alert-badge h2 { margin: 0 0 10px 0; font-size: 18px; }
            .content { padding: 30px; }
            .message-box { background-color: #fdf4ff; border-left: 4px solid #ec4899; padding: 20px; margin: 20px 0; border-radius: 8px; }
            .message-box p { margin: 0; font-style: italic; color: #6b7280; font-size: 16px; line-height: 1.6; }
            .timestamp { color: #9ca3af; font-size: 12px; margin-top: 10px; }
            .action-section { background-color: #fef3c7; border-radius: 12px; padding: 20px; margin: 20px 0; }
            .action-section h3 { color: #92400e; margin: 0 0 15px 0; }
            .action-section ul { margin: 0; padding-left: 20px; color: #78350f; }
            .action-section li { margin: 8px 0; }
            .footer { background-color: #fdf2f8; padding: 20px; text-align: center; color: #9ca3af; font-size: 14px; }
            .heart { color: #ec4899; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💕 FEMCARE Wellness Platform</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Guardian Alert Notification</p>
            </div>
            
            <div class="alert-badge">
              <h2>🚨 Immediate Attention Required</h2>
              <p>Our wellness system has detected a message that may indicate emotional distress.</p>
            </div>
            
            <div class="content">
              <h3>The following message was shared:</h3>
              <div class="message-box">
                <p>"${userMessage}"</p>
                <div class="timestamp">Detected at: ${timestamp}</div>
              </div>
              
              <div class="action-section">
                <h3>💛 Recommended Actions:</h3>
                <ul>
                  <li>Reach out to the user as soon as possible</li>
                  <li>Provide a safe, non-judgmental space for them to talk</li>
                  <li>If you're concerned about their immediate safety, consider professional support</li>
                  <li>Let them know they are loved and not alone</li>
                </ul>
              </div>
              
              <p style="color: #6b7280; line-height: 1.8;">
                This automated alert was sent because FEMCARE cares about the wellbeing of every user. 
                Your support and presence can make a significant difference.
              </p>
            </div>
            
            <div class="footer">
              <p class="heart">💕</p>
              <p>With care,<br><strong>FEMCARE Wellness Platform</strong></p>
              <p style="font-size: 12px; color: #d1d5db;">This is an automated safety notification.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Guardian email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending guardian email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
