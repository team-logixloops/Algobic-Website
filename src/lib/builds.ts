/**
 * The build index.
 *
 * Fields mirror the frontmatter in `website.md` so that when builds move to
 * MDX files nothing has to be remapped, and so the same shape survives the
 * eventual move to a database.
 */

export type Build = {
  slug: string;
  title: string;
  oneLine: string;
  /** ISO date. Drives freshness signals. */
  shipped: string;
  /** ISO date. Bump only on substantive change. */
  updated: string;
  /** Stored in minutes so "3h 20m" is exact rather than rounded. */
  minutes: number;
  tools: readonly string[];
  codeWritten: boolean;
  /** Must stay reachable. A dead URL means the page is pulled or converted. */
  liveUrl: string;
  builder: string;
  /** INR. Must be 0 to qualify as a build page rather than a case study. */
  cost: number;
  difficulty: "first-build" | "second" | "harder";

  /** Detailed breakdown for /builds/[slug] */
  whatItDoes: string;
  whyItMatters: string;
  highlights: readonly string[];
  useCases: readonly string[];
  architecture?: readonly {
    step: string;
    tool: string;
    role: string;
  }[];
  thePath: readonly {
    step: number;
    title: string;
    detail: string;
    prompt?: string;
  }[];
  whereItBroke: {
    tell: string;
    breakdown: string;
    solution: string;
  };
  costBreakdown: readonly {
    item: string;
    cost: string;
    note: string;
  }[];
  makeItYours: readonly string[];
};

export const BUILDS: readonly Build[] = [
  {
    slug: "sara-ai-voice-reservation-agent",
    title: "SARA AI — Voice-Driven Hotel & Restaurant Reservation Agent",
    oneLine:
      "An AI voice agent that handles hotel and restaurant bookings through natural, real-time conversation on a live speech pipeline with automated SMS confirmations via Twilio.",
    shipped: "2026-08-30",
    updated: "2026-08-30",
    minutes: 210,
    tools: ["LiveKit", "Deepgram", "Gemini", "Cartesia", "Twilio"],
    codeWritten: true,
    liveUrl: "https://sara-ai.algobic.in",
    builder: "LogixLoops",
    cost: 0,
    difficulty: "second",

    whatItDoes:
      "Guests call in or speak through a web interface and book rooms or tables the way they'd talk to a front-desk agent: no forms, no hold music. The system tracks multi-turn conversations (so a guest can change their mind mid-booking, ask follow-up questions, or add special requests without restarting), checks availability in real time, and applies a configurable pricing/negotiation layer that can offer discounts within bounds the property sets, rather than a fixed rate-card. Once a booking is confirmed, the guest gets an SMS confirmation automatically. A separate admin dashboard gives staff visibility into bookings as they come in.",

    whyItMatters:
      "Hotels—especially smaller or boutique properties—lose bookings to unanswered calls and slow response times, particularly outside business hours. A voice agent that can hold a real conversation (not an IVR menu tree) closes that gap: it's always available, it doesn't put guests through 'press 1 for reservations,' and it can flex on price within limits instead of forcing a take-it-or-leave-it rate.",

    highlights: [
      "Real-time streaming voice pipeline (STT → LLM → TTS) with session/context management across multi-turn dialogue",
      "Rule-based dynamic pricing engine with configurable negotiation bounds by room type/season",
      "Guest-facing web interface + separate admin dashboard for staff",
      "Automated SMS confirmation flow via Twilio",
    ],

    useCases: [
      "Boutique hotels & independent resorts",
      "Small hotel chains & bed-and-breakfasts",
      "Restaurant reservation & dining tables",
      "Resort package & weekend getaway bookings",
    ],

    architecture: [
      {
        step: "01 / Transport",
        tool: "LiveKit",
        role: "WebRTC audio transport and bi-directional real-time agent session orchestration",
      },
      {
        step: "02 / Transcribe",
        tool: "Deepgram Nova-2",
        role: "Streaming speech-to-text with voice activity detection (VAD) and sub-300ms latency",
      },
      {
        step: "03 / Reasoning",
        tool: "Google Gemini 2.0 Flash",
        role: "Multi-turn intent recognition, availability tool calling, and discount negotiation logic",
      },
      {
        step: "04 / Synthesis",
        tool: "Cartesia Sonic",
        role: "Ultra-low latency expressive text-to-speech with natural conversational pacing",
      },
      {
        step: "05 / Dispatch",
        tool: "Twilio SMS & Voice",
        role: "Telephony SIP trunking and automated instant SMS booking confirmation flow",
      },
    ],

    thePath: [
      {
        step: 1,
        title: "Provisioning the LiveKit Agent & Speech Pipeline",
        detail:
          "Spin up a LiveKit Cloud session and connect Deepgram Nova-2 for streaming STT and Cartesia for sub-200ms voice synthesis. Configure turn-detection with endpointing so the agent doesn't interrupt natural mid-sentence pauses.",
        prompt:
          "Configure LiveKit voice agent session with Deepgram STT (model: 'nova-2', endpointing: 400ms) and Cartesia TTS (model: 'sonic-english'). Enable bi-directional audio streaming with interruption detection.",
      },
      {
        step: 2,
        title: "Prompt Engineering the Front-Desk Agent in Gemini",
        detail:
          "Author the system instructions defining SARA's persona: polite, concise, natural front-desk coordinator. Provide strict schema for room/table availability tools and date parsing.",
        prompt:
          "You are SARA, an AI front-desk reservation agent for Grand Vista Hotel. Greet guests warmly, answer room/amenities questions concisely (1-2 sentences per turn), and check check-in/check-out dates. Never list raw JSON. If a guest asks for a discount, check get_discount_bounds() before confirming any rate.",
      },
      {
        step: 3,
        title: "Dynamic Pricing & Negotiation Boundary Tool",
        detail:
          "Implement a deterministic tool function for Gemini that evaluates stay length, room category, and occupancy rate to return a permissible discount window (max 15%) without letting the model invent arbitrary rates.",
        prompt:
          "def calculate_rate(room_type: str, nights: int, requested_discount: float) -> dict:\n    # Rule-based guardrail: limit maximum discretionary discount to 15%\n    allowed_discount = min(requested_discount, 0.15 if nights >= 3 else 0.05)\n    final_rate = base_price * (1 - allowed_discount)\n    return {'rate': final_rate, 'confirmed': True}",
      },
      {
        step: 4,
        title: "Twilio SMS Confirmation & Admin Dashboard",
        detail:
          "Hook up the post-reservation webhook to trigger a Twilio SMS dispatch with booking reference number, check-in date, and Google Maps location link. Feed real-time reservation logs to the staff dashboard.",
        prompt:
          "client.messages.create(to=guest_phone, from_=twilio_number, body=f'Confirmed! Booking #{ref_id} at Grand Vista Hotel for {dates}. Check-in at 2:00 PM. See you soon!')",
      },
    ],

    whereItBroke: {
      tell: "The model accepted an absurd 60% discount request from a guest when asked repeatedly with polite pressure.",
      breakdown:
        "Because the LLM had room rate information in its system prompt without a hard programmatic clamp, prolonged multi-turn conversational pressure convinced the model to override its instructions and offer 60% off.",
      solution:
        "Stripped rate calculation authority from the LLM prompt. All discounts are now calculated exclusively inside a deterministic tool function ('calculate_rate') with hard server-side floor bounds. The model can only report the function's return value.",
    },

    costBreakdown: [
      {
        item: "LiveKit Cloud",
        cost: "₹0",
        note: "100 free monthly agent minutes",
      },
      {
        item: "Deepgram Nova-2",
        cost: "₹0",
        note: "₹16,000 ($200) free trial credits",
      },
      {
        item: "Google Gemini API",
        cost: "₹0",
        note: "Free tier (15 RPM / 1M TPM)",
      },
      {
        item: "Cartesia Sonic",
        cost: "₹0",
        note: "Free starter tier",
      },
      {
        item: "Twilio",
        cost: "₹0",
        note: "Free trial balance covers demo SMS",
      },
    ],

    makeItYours: [
      "Doctor Clinic Appointment Voice Agent: Replaces room types with doctors/specialties and patient slots with calendar sync.",
      "Salon & Spa Booking Assistant: Handles stylist selection, service packages, and SMS reminders with cancellation links.",
      "Car Rental Scheduler: Handles vehicle category selection, pickup dates, and deposit calculation with instant SMS receipts.",
    ],
  },
  {
    slug: "synapse-infra-control-agent",
    title: "SYNAPSE — Natural-Language Infrastructure Control Agent",
    oneLine:
      "An autonomous infrastructure control agent that translates natural-language goals into verified multi-step execution plans across remote Linux, Docker, Kubernetes, AWS, and local systems.",
    shipped: "2026-08-30",
    updated: "2026-08-30",
    minutes: 240,
    tools: ["LangGraph", "FastAPI", "Groq", "Docker", "Kubernetes"],
    codeWritten: true,
    liveUrl: "https://synapse.algobic.in",
    builder: "LogixLoops",
    cost: 0,
    difficulty: "harder",

    whatItDoes:
      "Instead of manually SSH-ing into a server, running the right Docker command, copying a container ID, and curling an endpoint, you describe the outcome: 'build the Flask image on the RHEL server, run it on port 5000, curl the health check, and SMS me the response.' SYNAPSE breaks that into a step plan, executes each step with the appropriate tool, verifies success (not just that a tool ran, but that it didn't report success: false), retries once on failure, and replans (capped at 2 replans per session) if a step still fails. Simple queries ('list running docker containers') skip planning and go straight to a single ReAct tool call. Compound commands trigger a Planner → Executor loop, with the live plan rendered in the UI as it executes.",

    whyItMatters:
      "This is the gap between 'an LLM wrapper that answers questions' and 'an agent that does things and knows whether they worked.' The verify → retry → replan loop is the part most toy agent demos skip — it's what makes multi-step automation trustworthy enough to point at a real server instead of a sandbox. What it controls: remote Linux (SSH via paramiko), local Docker, local Kubernetes (kubectl), local PowerShell, AWS CLI, local ML training (scikit-learn), GitHub Actions, plus email/SMS/Telegram notifications.",

    highlights: [
      "Planner/Executor architecture with automatic retry and bounded replanning (capped at 2 replans per session), not just a single LLM tool-call loop",
      "Model router with provider fallback chain (Groq Llama-3.3 → Gemini 2.0 → Cerebras → local Ollama) for resilient execution with zero rate-limit downtime",
      "Strict safety gates: destructive commands (recursive delete, docker prune/rm, kubectl delete, AWS terminate) require human-in-the-loop confirmation",
      "Real-time plan visualization over WebSocket (Socket.IO) streaming live step progress and terminal outputs to the React frontend",
      "Complete pytest test suite covering tools, planner, executor, and router, plus full CI workflow",
    ],

    useCases: [
      "Personal homelab and server infrastructure management",
      "Quick-turnaround DevOps and container operations where describing the outcome is faster than writing commands",
      "Multi-cloud deployment orchestration and automated health-check verification",
      "Reference architecture for building safe, verified autonomous agents against real-world systems",
    ],

    architecture: [
      {
        step: "01 / Router",
        tool: "Multi-Provider Router",
        role: "Provider fallback chain (Groq Llama-3.3 → Gemini 2.0 → Cerebras → Ollama) for zero rate-limit downtime",
      },
      {
        step: "02 / Planning",
        tool: "LangGraph Planner",
        role: "DAG plan generation with verify-retry-replan loop (capped at 2 replans per session)",
      },
      {
        step: "03 / Safety",
        tool: "Policy & Confirmation Gate",
        role: "Blocks destructive commands (rm -rf, docker prune, kubectl delete) until user confirmation",
      },
      {
        step: "04 / Execution",
        tool: "Tool Executor",
        role: "Remote SSH (Paramiko), Docker Engine, kubectl, AWS CLI, and PowerShell runtime adapters",
      },
      {
        step: "05 / Telemetry",
        tool: "Socket.IO Stream",
        role: "Real-time WebSocket step status streaming to React frontend + Telegram/SMS dispatch",
      },
    ],

    thePath: [
      {
        step: 1,
        title: "Building the Model Router & Provider Fallback Chain",
        detail:
          "Set up the multi-provider client pool prioritizing ultra-fast Groq Llama-3.3 70B with automatic fallback to Gemini 2.0 Flash and local Ollama when hitting rate limits or network drops.",
        prompt:
          "Implement Router with fallback priority: [Groq(llama-3.3-70b-versatile), Gemini(gemini-2.0-flash), Cerebras(llama-3.1-70b), Ollama(local-qwen)]. Catch 429 RateLimitError and transparently reroute to next provider.",
      },
      {
        step: 2,
        title: "LangGraph State Machine with Verify-Retry-Replan Loop",
        detail:
          "Construct the LangGraph workflow separating simple ReAct tool queries from compound goal planning. Inject post-step verification that inspects stderr and return codes before advancing.",
        prompt:
          "StateGraph(AgentState): RouterNode -> [SimpleReAct | PlannerExecutor]. PlannerNode creates Plan(steps=[Step]). ExecutorNode runs tool -> VerifierNode checks (exit_code == 0 and 'error' not in stderr). If failed: RetryNode(max=1) -> ReplanNode(max=2).",
      },
      {
        step: 3,
        title: "Safety Interceptors & Destructive Action Gates",
        detail:
          "Implement AST and regex security interceptors that intercept dangerous operations (recursive deletion, container prunes, cluster teardowns) and require interactive human-in-the-loop approval.",
        prompt:
          "BLOCKED_PATTERNS = [r'rm\\s+(-rf|-fr)', r'docker\\s+(system\\s+prune|rm\\s+-f)', r'kubectl\\s+delete\\s+(all|namespace)']. Intercept command before execution; if matches: yield Event(status='NEEDS_CONFIRMATION', action_id=uuid).",
      },
      {
        step: 4,
        title: "Socket.IO Real-Time Visualization & Alert Dispatch",
        detail:
          "Stream live step status, terminal output snippets, and retry counts over WebSockets to the React frontend while triggering Telegram/Twilio alerts upon overall workflow completion.",
        prompt:
          "@sio.on('goal') async def handle_goal(sid, data): async for event in agent.astream_events(data['goal']): await sio.emit('step_update', {'step_id': event.id, 'status': event.status, 'output': event.output})",
      },
    ],

    whereItBroke: {
      tell: "The agent parsed an exit code of 0 from a command that silently logged 'Docker daemon not running' to stdout, falsely reporting step success.",
      breakdown:
        "Standard ReAct tool executor checked only OS return code ($? == 0). Many CLI utilities write failure notices to stdout while still exiting with code 0.",
      solution:
        "Built a semantic verifier layer that performs regex heuristics on stdout/stderr and runs an active probe check (e.g., verifying port 5000 responds with HTTP 200) rather than trusting return codes alone.",
    },

    costBreakdown: [
      {
        item: "Groq Cloud",
        cost: "₹0",
        note: "Free tier (30 RPM / 14.4k TPM) covers real-time planning and execution",
      },
      {
        item: "Google Gemini API",
        cost: "₹0",
        note: "Free tier (15 RPM / 1M TPM) fallback provider",
      },
      {
        item: "Local Docker & Kubernetes",
        cost: "₹0",
        note: "Runs locally on workstation or homelab node",
      },
      {
        item: "Telegram Bot API",
        cost: "₹0",
        note: "Unlimited free instant alert notifications",
      },
      {
        item: "FastAPI, LangGraph & Socket.IO",
        cost: "₹0",
        note: "Open-source runtime stack (MIT / Apache 2.0)",
      },
    ],

    makeItYours: [
      "Database Migration & Backup Agent: Automates PostgreSQL schema backups, runs migrations, verifies table indices, and posts audit logs.",
      "CI/CD Incident Triage Agent: Listens to GitHub Actions failure webhooks, fetches workflow logs, isolates stack traces, and suggests code fixes.",
      "Multi-Cloud Cost Optimizer Agent: Queries AWS, GCP, and DigitalOcean APIs to identify unattached EBS volumes and idle VM instances, requesting approval before downsizing.",
    ],
  },
  {
    slug: "edgesafety-ai-ppe-compliance-detection",
    title: "EdgeSafety-AI — Real-Time PPE & Safety Compliance Detection",
    oneLine:
      "An ensemble computer-vision compliance system running three specialized YOLOv8 models with custom IoU tracking, 10-frame EMA temporal smoothing, and multi-channel alerting across Telegram, Twilio, and Discord.",
    shipped: "2026-08-30",
    updated: "2026-08-30",
    minutes: 180,
    tools: ["YOLOv8", "FastAPI", "OpenCV", "Ultralytics", "Telegram API"],
    codeWritten: true,
    liveUrl: "https://edgesafety.algobic.in",
    builder: "LogixLoops",
    cost: 0,
    difficulty: "second",

    whatItDoes:
      "Rather than relying on a single detection model, EdgeSafety-AI runs three specialized YOLOv8 models in an ensemble — one tuned for helmets, one for gloves, and one covering the broader class set (vests, masks, goggles, falls, ladders, cones) — and merges their outputs into one unified 14-class detection registry using a custom IoU tracker to resolve overlapping detections between models. A 10-frame EMA smoothing layer prevents the flickering false positives that plague naive frame-by-frame detection in live video. The web dashboard streams the live feed, lets you isolate detection to a specific PPE category, shows live violation counts, and pushes alerts to Telegram, Twilio SMS, or Discord when a violation is tracked (not just detected once — deduplicated so one missing helmet doesn't spam ten alerts).",

    whyItMatters:
      "Manual safety compliance monitoring on a construction site or in a lab doesn't scale — you need either constant human oversight or you accept blind spots. Automated PPE detection turns a camera feed already there into a compliance layer, catching violations as they happen instead of after an incident report. The ensemble-over-single-model design is the key engineering choice here: splitting detection classes across specialized models and reconciling them via IoU tracking yields significantly higher recall on fine-grained objects like gloves without degrading full-body detection accuracy.",

    highlights: [
      "3-model YOLOv8 ensemble reconciled into one 14-class global registry via custom IoU-based bounding-box tracker",
      "Temporal smoothing (10-frame EMA + 30-frame hysteresis threshold) engineered to eliminate live-feed bounding box flicker",
      "Per-class confidence threshold overrides (e.g. 70% floor for gloves) to suppress false positives on challenging micro-textures",
      "FastAPI dashboard with multipart MJPEG video streaming, dynamic category isolation, and live training metric visualizer (mAP, Precision, Recall)",
      "Deduplicated multi-channel alerting dispatcher across Telegram Bot, Twilio SMS, and Discord webhooks",
    ],

    useCases: [
      "Construction & industrial site safety monitoring (helmets, vests, harness, fall detection)",
      "Healthcare & cleanroom bio-lab sanitary compliance (surgical masks, protective goggles, nitrile gloves)",
      "Hazardous machinery & restricted perimeter boundary monitoring (cone placement, ladder stability)",
      "Automated safety audit log generation for workplace regulatory compliance",
    ],

    architecture: [
      {
        step: "01 / Ingestion",
        tool: "OpenCV Video Stream",
        role: "RTSP / camera feed frame capture with resolution downsampling and color-space normalization",
      },
      {
        step: "02 / Ensemble",
        tool: "3x YOLOv8 Models",
        role: "Parallel inference across specialized heads: Helmet Model, Glove Model, and Broad PPE/Fall Model",
      },
      {
        step: "03 / Reconcile",
        tool: "Custom IoU Tracker",
        role: "Bounding-box overlap resolution across models and 14-class unified registry mapping",
      },
      {
        step: "04 / Filter",
        tool: "10-Frame EMA Smoother",
        role: "Temporal exponential moving average smoothing + 30-frame violation confirmation hysteresis",
      },
      {
        step: "05 / Dispatch",
        tool: "FastAPI & Webhooks",
        role: "Multipart MJPEG web streaming + deduplicated Telegram/Discord/SMS alert dispatch",
      },
    ],

    thePath: [
      {
        step: 1,
        title: "Training and Exporting Specialized YOLOv8 Models",
        detail:
          "Train three separate YOLOv8 nano/small models on targeted datasets: one optimized for headwear (helmets/hard hats), one for hand gear (gloves), and one broad model for torso PPE and posture anomalies.",
        prompt:
          "Train YOLOv8 on dataset with custom classes. Hyperparameters: epochs=50, imgsz=640, batch=16, augment=True. Export weights to helmet_yolo.pt, glove_yolo.pt, general_ppe.pt.",
      },
      {
        step: 2,
        title: "Building the IoU Ensemble Reconciler & Class Registry",
        detail:
          "Write an IoU tracking algorithm that accepts bounding boxes from all three models concurrently, calculates intersection-over-union matrix, and eliminates duplicate detections with per-class confidence scoring.",
        prompt:
          "def merge_detections(boxes_model_a, boxes_model_b, iou_thresh=0.5):\n    # Reconcile multi-model detections into unified 14-class schema\n    # Apply per-class confidence overrides (e.g. gloves >= 0.70, helmets >= 0.55)\n    return deduplicated_detections",
      },
      {
        step: 3,
        title: "Temporal EMA Smoothing & Violation State Machine",
        detail:
          "Implement a rolling 10-frame exponential moving average for bounding box coordinates and a 30-frame persistence threshold before firing alert triggers to prevent transient false alarms.",
        prompt:
          "class TrackedViolation:\n    def update(self, detected: bool):\n        self.ema_score = 0.8 * self.ema_score + 0.2 * float(detected)\n        if self.ema_score > 0.65 and self.consecutive_frames >= 30 and not self.alerted:\n            self.trigger_alert()",
      },
      {
        step: 4,
        title: "FastAPI Streaming Dashboard & Multi-Channel Webhooks",
        detail:
          "Create a lightweight FastAPI video streaming endpoint serving multipart JPEG frames to the browser, with webhook handlers for Telegram, Discord, and Twilio SMS.",
        prompt:
          "@app.get('/video_feed')\ndef video_feed():\n    return StreamingResponse(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')",
      },
    ],

    whereItBroke: {
      tell: "Worker hands resting on yellow handrails caused continuous false 'missing glove' alert storms on naive single-frame detection.",
      breakdown:
        "Yellow construction handrails had texture and color profiles similar to worker skin tones in low-light camera angles, triggering intermittent glove false-negatives.",
      solution:
        "Implemented a 30-frame temporal hysteresis filter combined with an increased glove confidence floor (70% minimum threshold). The alert now only triggers when absence is persistently tracked across 1+ full second of video.",
    },

    costBreakdown: [
      {
        item: "Ultralytics YOLOv8",
        cost: "₹0",
        note: "Open-source AGPL-3.0 computer vision models",
      },
      {
        item: "FastAPI & OpenCV",
        cost: "₹0",
        note: "Open-source Python video processing and API backend",
      },
      {
        item: "Telegram Bot API",
        cost: "₹0",
        note: "Free real-time alert notifications with image snapshots",
      },
      {
        item: "Discord Webhooks",
        cost: "₹0",
        note: "Free team channel violation audit log stream",
      },
      {
        item: "Local / Edge Hardware",
        cost: "₹0",
        note: "Runs locally on standard CPU / consumer GPU workstation",
      },
    ],

    makeItYours: [
      "Laboratory Cleanroom Sterility Monitor: Detects hairnet, lab coat, face shield, and nitrile glove compliance in pharmaceutical production zones.",
      "Factory Floor Forklift Exclusion Zone Monitor: Tracks forklift movement and alerts pedestrians stepping inside active 3-meter safety envelopes.",
      "Kitchen Hygiene Compliance Sentinel: Verifies chef hats, beard nets, and thermal gloves in commercial restaurant kitchens.",
    ],
  },
  {
    slug: "pixel-info-cnn-lstm-image-captioning",
    title: "Pixel_Info — Image Captioning with CNN-LSTM and Beam Search Decoding",
    oneLine:
      "An end-to-end deep learning captioning pipeline pairing a frozen ResNet50 visual encoder with a custom LSTM decoder, comparing greedy decoding against length-normalized beam search.",
    shipped: "2026-08-30",
    updated: "2026-08-30",
    minutes: 150,
    tools: ["PyTorch", "ResNet50", "FastAPI", "Next.js", "NLTK"],
    codeWritten: true,
    liveUrl: "https://pixelinfo.algobic.in",
    builder: "LogixLoops",
    cost: 0,
    difficulty: "second",

    whatItDoes:
      "Upload an image, get back a natural-language caption. Under the hood: a frozen ResNet50 (ImageNet-pretrained) extracts a 2048-dimensional feature vector, which is projected down to 512 dimensions and fused with learned word embeddings inside an LSTM decoder to generate captions token by token. Two distinct decoding strategies are implemented and empirically evaluated — greedy decoding and length-normalized beam search (k=3) — rather than just shipping one and assuming superiority.",

    whyItMatters:
      "This is a from-scratch implementation and evaluation of the classic CNN-encoder / RNN-decoder captioning architecture, conducted with genuine experimental rigor: strict image-level train/validation splitting (preventing data leakage across multi-caption datasets), systematic BLEU-1 through BLEU-4 benchmark scoring, and honest reporting of where beam search underperforms greedy decoding. Beam search produces 13% longer, more descriptive phrase structures at the trade-off of exact single-word overlap with reference sets — an insightful finding documented with real telemetry rather than cherry-picked metrics.",

    highlights: [
      "Transfer learning pipeline via frozen ResNet50 vision backbone + custom linear projection into 512-dim LSTM hidden space",
      "Empirical comparative evaluation of Greedy Decoding vs. Length-Normalized Beam Search (k=3)",
      "Automated BLEU-1 through BLEU-4 quantitative scoring matrix with NLTK smoothing",
      "Production-grade training loop: Automatic Mixed Precision (AMP), ReduceLROnPlateau scheduling, and early stopping",
      "FastAPI inference backend with single-load model caching at startup + Next.js 15 / TypeScript interactive frontend",
    ],

    useCases: [
      "Automated alt-text and accessibility description generation for digital media libraries",
      "Semantic image indexing and visual search cataloging for e-commerce platforms",
      "Visual asset tagging and metadata extraction for content management systems",
      "Educational baseline for studying encoder-decoder multimodal alignment and decoding heuristics",
    ],

    architecture: [
      {
        step: "01 / Encoding",
        tool: "ResNet50 Backbone",
        role: "Frozen ImageNet visual feature extraction generating 2048-dim representation vectors",
      },
      {
        step: "02 / Projection",
        tool: "Linear Fusion Layer",
        role: "Dimension reduction from 2048 to 512 dimensions with batch normalization and dropout",
      },
      {
        step: "03 / Decoding",
        tool: "PyTorch LSTM Decoder",
        role: "Autoregressive token generation combining image vector with learned word embeddings",
      },
      {
        step: "04 / Search",
        tool: "Beam Search (k=3)",
        role: "Length-normalized cumulative probability search across top candidate sequence beams",
      },
      {
        step: "05 / Delivery",
        tool: "FastAPI & Next.js",
        role: "Cached in-memory model inference serving real-time captions to a Next.js 15 interface",
      },
    ],

    thePath: [
      {
        step: 1,
        title: "Feature Extraction with Pretrained ResNet50 Backbone",
        detail:
          "Freeze early convolutional layers of ResNet50, remove the final classification head, and extract 2048-dimensional visual vectors from the global average pooling layer.",
        prompt:
          "class ResNetEncoder(nn.Module):\n    def __init__(self, embed_size=512):\n        super().__init__()\n        resnet = models.resnet50(weights=models.ResNet50_Weights.DEFAULT)\n        for param in resnet.parameters(): param.requires_grad = False\n        self.backbone = nn.Sequential(*list(resnet.children())[:-1])\n        self.projection = nn.Linear(2048, embed_size)",
      },
      {
        step: 2,
        title: "Building the Word-Embedding LSTM Decoder",
        detail:
          "Construct the recurrent decoder initializing hidden states with projected image embeddings and sequencing word tokens with teacher forcing during training.",
        prompt:
          "class DecoderLSTM(nn.Module):\n    def __init__(self, embed_size, hidden_size, vocab_size, num_layers=1):\n        super().__init__()\n        self.embed = nn.Embedding(vocab_size, embed_size)\n        self.lstm = nn.LSTM(embed_size, hidden_size, num_layers, batch_first=True)\n        self.linear = nn.Linear(hidden_size, vocab_size)",
      },
      {
        step: 3,
        title: "Implementing Length-Normalized Beam Search",
        detail:
          "Write custom beam search keeping top k=3 candidate hypotheses at each step, dividing log-probability sum by length penalty (length^alpha) to prevent favoring short phrases.",
        prompt:
          "def beam_search(encoder_out, k=3, max_len=20, alpha=0.7):\n    # Maintain top-k sequences scored by: sum(log_probs) / (len^alpha)\n    # Terminate beams hitting <EOS> token or max_len\n    return best_caption",
      },
      {
        step: 4,
        title: "FastAPI Model Cache & Next.js 15 Interface",
        detail:
          "Wrap PyTorch weights in a singleton startup lifespan in FastAPI and connect an image dropzone UI built in Next.js 15 that visualizes greedy vs. beam search comparison.",
        prompt:
          "@asynccontextmanager\nasync def lifespan(app: FastAPI):\n    app.state.model = load_caption_model('weights/best_lstm.pt')\n    app.state.vocab = load_vocab('vocab.json')\n    yield",
      },
    ],

    whereItBroke: {
      tell: "Standard beam search without length normalization consistently produced clipped 2-3 word captions like 'a dog' instead of descriptive sentences.",
      breakdown:
        "Because probabilities are strictly between 0 and 1, multiplying probabilities (or summing negative log probabilities) naturally penalizes longer sequences, causing unnormalized beam search to favor trivially short captions.",
      solution:
        "Added length normalization with penalty factor alpha = 0.7: score = sum(log_p) / (len ** 0.7). This leveled the playing field for descriptive phrases, increasing average caption length by 13% with richer adjectives.",
    },

    costBreakdown: [
      {
        item: "PyTorch & TorchVision",
        cost: "₹0",
        note: "Open-source BSD-3-clause deep learning framework",
      },
      {
        item: "FastAPI Inference Server",
        cost: "₹0",
        note: "Open-source asynchronous Python backend",
      },
      {
        item: "Next.js 15 & Tailwind v4",
        cost: "₹0",
        note: "Open-source React frontend on free Vercel hobby tier",
      },
      {
        item: "Google Colab GPU / Local CUDA",
        cost: "₹0",
        note: "Trained on free Colab T4 GPU instance",
      },
      {
        item: "NLTK Library",
        cost: "₹0",
        note: "Open-source BLEU evaluation metric suite",
      },
    ],

    makeItYours: [
      "Medical X-Ray Report Generator: Replaces natural images with chest radiographs to generate preliminary radiological finding summaries.",
      "Automated E-Commerce Product Tagger: Generates descriptive SEO product titles from multi-angle catalog photography.",
      "Audio Spectrogram Descriptor: Pairs CNN audio spectrogram encoders with LSTM decoders to describe ambient audio scenes in text.",
    ],
  },
  {
    slug: "sentinel-institutional-bias-detection",
    title: "SENTINEL — AI-Powered Institutional Bias Detection for Civic Complaints",
    oneLine:
      "A forensic analytics platform that detects patterns of systemic neglect in civic complaints, scoring silence metrics (0–100) and pairing Qdrant semantic search with Gemini 2.5 Flash conversational chart generation.",
    shipped: "2026-08-30",
    updated: "2026-08-30",
    minutes: 200,
    tools: ["Gemini 2.5", "Qdrant", "Flask", "Sentence-Transformers", "Chart.js"],
    codeWritten: true,
    liveUrl: "https://sentinel.algobic.in",
    builder: "LogixLoops",
    cost: 0,
    difficulty: "second",

    whatItDoes:
      "Every complaint gets scored on a 0–100 'Silence Score' derived from days pending, ignored follow-ups, dismissed escalation attempts, and category-level historical neglect rates. Scores above 70 flag likely systematic silencing. On top of that, a conversational AI agent (Gemini 2.5 Flash, with semantic search over 10,000+ records via Qdrant and BAAI/bge-small-en-v1.5 embeddings) lets investigators ask natural-language questions ('which wards have the highest silence rates?') and get back both an evidence-grounded answer and an interactive Chart.js visualization, with session memory persisted directly in the vector store.",

    whyItMatters:
      "Institutional bias in complaint-handling is usually invisible precisely because it's diffuse — no single decision looks discriminatory, but aggregate patterns reveal severe demographic, geographic, and temporal disparities. A forensic tool that quantifies 'silence' as an objective, measurable score and lets non-technical oversight teams interrogate datasets conversationally rather than writing complex SQL transforms accountability workflows. Validated against synthetic ground truth (10,000+ records with injected bias distributions) before real-world deployment, ensuring the methodology is provably sound.",

    highlights: [
      "Multi-dimensional bias scoring: demographic, ward-level geographic, category, and temporal decay combined into an interpretable 0–100 Silence Score",
      "Semantic search across 10,000+ complaint records using Qdrant vector database + BAAI/bge-small-en-v1.5 embeddings",
      "Conversational forensic agent powered by Gemini 2.5 Flash that synthesizes answers and generates dynamic Chart.js configurations on the fly",
      "Persistent multi-turn chat memory stored directly within vector collections without needing an external session cache",
      "13-endpoint Flask REST API cleanly decoupling high-throughput analytical queries from conversational inference",
    ],

    useCases: [
      "Civic tech & municipal ombudsman oversight for tracking equitable public service delivery across city wards",
      "Consumer protection bureaus auditing complaint resolution delays by vendor category and socioeconomic tier",
      "University & institutional grievance committees spotting systemic reporting bottlenecks and unaddressed escalations",
      "Methodological baseline for auditing public algorithmic decision-making and administrative intake fairness",
    ],

    architecture: [
      {
        step: "01 / Scoring",
        tool: "Silence Engine",
        role: "Calculates 0–100 Silence Score from days pending, missed escalations, and category neglect priors",
      },
      {
        step: "02 / Embeddings",
        tool: "bge-small-en-v1.5",
        role: "Transforms complaint narratives and resolution logs into 384-dim dense semantic vectors",
      },
      {
        step: "03 / Retrieval",
        tool: "Qdrant Vector DB",
        role: "Performs cosine similarity search + demographic metadata payload filtering across 10,000+ records",
      },
      {
        step: "04 / Synthesis",
        tool: "Gemini 2.5 Flash",
        role: "Conversational forensic reasoning, evidence cross-referencing, and dynamic Chart.js JSON schema generation",
      },
      {
        step: "05 / Delivery",
        tool: "Flask API & Chart.js",
        role: "13-endpoint analytical backend serving interactive forensic dashboards and visualization canvases",
      },
    ],

    thePath: [
      {
        step: 1,
        title: "Mathematical Formulation of the Silence Score Metric",
        detail:
          "Implement the core scoring algorithm weighting unresolved duration, escalation count, ignored messages, and category-level decay rates into a normalized 0–100 score.",
        prompt:
          "def calculate_silence_score(row: dict) -> float:\n    # Formula: w1*days_pending_norm + w2*escalations_norm + w3*ignored_replies_norm + w4*category_penalty\n    # Normalize to [0, 100]. Flag score >= 70.0 as 'HIGH_RISK_SYSTEMIC_SILENCE'",
      },
      {
        step: 2,
        title: "Vectorizing Narratives with Qdrant and BGE Embeddings",
        detail:
          "Embed 10,000+ complaint records using fast Sentence-Transformers bge-small-en-v1.5 and index them into Qdrant collections with rich payload schemas for ward and demographic filters.",
        prompt:
          "qdrant.create_collection(\n    collection_name='civic_complaints',\n    vectors_config=VectorParams(size=384, distance=Distance.COSINE)\n)\n# Upload points with payload: {ward: int, category: str, silence_score: float, text: str}",
      },
      {
        step: 3,
        title: "Gemini 2.5 Flash Chart Generation Tool Schema",
        detail:
          "Equip Gemini 2.5 Flash with structured output schemas to generate both natural-language forensic analysis and structured Chart.js configuration objects (type, labels, datasets, options).",
        prompt:
          "class ForensicResponse(BaseModel):\n    analysis: str\n    evidence_ids: list[str]\n    chart_type: Literal['bar', 'line', 'pie', 'none']\n    chart_config: Optional[dict] = None\n# Force Gemini to return valid JSON conforming to ForensicResponse",
      },
      {
        step: 4,
        title: "Flask Analytical API & Vector Session Memory",
        detail:
          "Build the 13-endpoint Flask backend handling faceted analytical filtering (demographic, geographic, temporal) and writing user conversation histories into Qdrant for semantic recall.",
        prompt:
          "@app.route('/api/chat', methods=['POST'])\ndef chat():\n    query = request.json.get('query')\n    history = qdrant.get_chat_history(session_id)\n    context = qdrant.similarity_search(query, filter={'silence_score': {'gte': 70}})\n    return jsonify(gemini_agent.query(query, context, history))",
      },
    ],

    whereItBroke: {
      tell: "The conversational agent frequently hallucinated ward-level totals by summing raw search samples rather than querying complete database aggregations.",
      breakdown:
        "Semantic search retrieves top-k relevant complaints (e.g. k=20), which the LLM mistook for the global count across the entire ward, claiming 'Ward 4 has only 12 complaints total'.",
      solution:
        "Separated macro statistical aggregation from semantic narrative retrieval. The agent now calls a deterministic 'get_ward_statistics()' tool for exact counts and percentages, using semantic retrieval strictly for qualitative context and evidence quotes.",
    },

    costBreakdown: [
      {
        item: "Google Gemini 2.5 Flash",
        cost: "₹0",
        note: "Free tier (15 RPM / 1M TPM) covers all conversational queries",
      },
      {
        item: "Qdrant Cloud / Local",
        cost: "₹0",
        note: "Free 1GB cluster / open-source local Docker container",
      },
      {
        item: "BAAI/bge-small-en-v1.5",
        cost: "₹0",
        note: "Open-source Hugging Face embedding model runs locally on CPU",
      },
      {
        item: "Flask & Chart.js",
        cost: "₹0",
        note: "Open-source Python web server and JavaScript visualization library",
      },
      {
        item: "Synthetic Data Generator",
        cost: "₹0",
        note: "Custom Python script producing 10,000+ benchmark records",
      },
    ],

    makeItYours: [
      "Tenant Rights & Housing Violation Auditor: Analyzes municipal code enforcement records to detect systemic delays in low-income rental inspection requests.",
      "Public Transit Reliability Investigator: Correlates bus cancellation rates and service alerts with neighborhood income and density metrics.",
      "Hospital Patient Feedback Disparity Tracker: Analyzes healthcare service reviews and clinical grievance resolutions across language and insurance barriers.",
    ],
  },
  {
    slug: "the-truth-herald-fake-news-detector",
    title: "The Truth Herald — AI Fake News Detector with a 1920s Broadsheet UI",
    oneLine:
      "A full-stack fake news classifier pairing a TF-IDF + Logistic Regression pipeline with a committed 1920s broadsheet UI and a zero-cloud mock-mode toggle for ₹0 portfolio longevity.",
    shipped: "2026-08-30",
    updated: "2026-08-30",
    minutes: 120,
    tools: ["React 19", "scikit-learn", "Firebase Functions", "Firestore", "Tailwind CSS v4"],
    codeWritten: true,
    liveUrl: "https://truthherald.algobic.in",
    builder: "LogixLoops",
    cost: 0,
    difficulty: "first-build",

    whatItDoes:
      "Paste any news article to receive an authenticity verdict (REAL vs. FAKE) accompanied by a confidence score and highlighted linguistic signals, rendered inside a 1920s vintage broadsheet newspaper interface featuring 3D paper unfolds, rubber-stamp verdict animations, and period typography. Under the hood: input text is preprocessed (lowercased, stripped of URLs/HTML, cleaned of stopwords), vectorised across 50,000 unigram/bigram features with TF-IDF, and scored using a class-balanced Logistic Regression model served from Cloud Storage via serverless Python functions.",

    whyItMatters:
      "Beyond the NLP classification mechanics, this build demonstrates an essential pattern for sustainable portfolio projects: clean dual-mode architecture. The app runs 100% client-side via a mock-mode toggle (VITE_USE_MOCK=true) requiring zero ongoing cloud infrastructure spend, while maintaining the full production pipeline (Firebase Auth, Firestore persistence, GCS model loading, and Vertex AI training) behind the same unified codebase. Visitors get instant, zero-latency interactive evaluation without the builder accumulating recurring server bills.",

    highlights: [
      "1920s vintage newspaper aesthetic featuring 3D paper-unfold transitions, rubber-stamp verdict decals, and Playfair Display serif typography",
      "Dual-mode architecture: zero-cloud mock demo mode for permanent free hosting + complete Firebase serverless production path",
      "Confidence-scored binary text classification pipeline (TF-IDF 50k n-grams + class-balanced Logistic Regression)",
      "Decoupled model storage: weights loaded lazily from Google Cloud Storage into serverless Python execution memory",
      "Honest dataset documentation: notes ISOT source-style distribution caveats alongside benchmark accuracy figures",
    ],

    useCases: [
      "Educational journalism & media literacy workshops for exploring linguistic disinformation patterns",
      "Browser extension baseline for real-time article headline and copy authenticity scoring",
      "Demonstration reference for building zero-maintenance cloud-optional web applications with rich visual themes",
      "Baseline classification pipeline for benchmarking transformer upgrades (DistilBERT/RoBERTa)",
    ],

    architecture: [
      {
        step: "01 / Input & Mode",
        tool: "React 19 & Vite",
        role: "Captures raw article text and routes to either zero-cloud mock engine or live backend based on environment flag",
      },
      {
        step: "02 / Preprocess",
        tool: "Python Regex & NLTK",
        role: "Lowercasing, URL/HTML tag stripping, tokenization, and stopword filtering",
      },
      {
        step: "03 / Vectorize",
        tool: "TF-IDF Vectorizer",
        role: "Transforms text into 50,000-dimensional sparse feature vectors across unigrams and bigrams",
      },
      {
        step: "04 / Classify",
        tool: "Logistic Regression",
        role: "Class-balanced binary probabilistic scoring generating authenticity predictions and confidence intervals",
      },
      {
        step: "05 / Delivery",
        tool: "Firebase Functions",
        role: "Serverless Python endpoint loading pickled model artifacts lazily from Cloud Storage with Firestore logging",
      },
    ],

    thePath: [
      {
        step: 1,
        title: "Building the Text Preprocessing & TF-IDF Feature Extractor",
        detail:
          "Clean article text by removing HTML entities, URLs, and punctuation before extracting 50,000 unigram/bigram features with sublinear TF scaling.",
        prompt:
          "def clean_text(text: str) -> str:\n    text = re.sub(r'https?://\\S+|www\\.\\S+|<.*?>', '', text.lower())\n    return ' '.join([w for w in text.split() if w not in STOPWORDS])\n\nvectorizer = TfidfVectorizer(max_features=50000, ngram_range=(1, 2), sublinear_tf=True)",
      },
      {
        step: 2,
        title: "Training Class-Balanced Logistic Regression Classifier",
        detail:
          "Train Logistic Regression with balanced class weighting to handle uneven sample counts, export serialized pickle weights to Cloud Storage.",
        prompt:
          "model = LogisticRegression(class_weight='balanced', C=1.0, max_iter=1000)\nmodel.fit(X_train_tfidf, y_train)\njoblib.dump(model, 'model.joblib')\njoblib.dump(vectorizer, 'vectorizer.joblib')",
      },
      {
        step: 3,
        title: "Designing the 1920s Broadsheet React Interface",
        detail:
          "Craft the vintage aesthetic using Tailwind CSS v4 custom color palettes (#f4ecd8 paper sepia), CSS 3D origami unfold transforms, and animated rubber-stamp verdicts.",
        prompt:
          "// Paper unfold animation with CSS 3D transform\n<div className='perspective-1000 bg-[#f4ecd8] border-4 border-double border-[#2b2b2b] p-8 shadow-2xl transition-transform duration-700 hover:rotate-x-2'>\n  <h1 className='font-serif text-5xl tracking-widest text-center border-b-2 border-black pb-4'>THE TRUTH HERALD</h1>\n</div>",
      },
      {
        step: 4,
        title: "Dual-Mode Cloud/Mock Switcher in Firebase Functions",
        detail:
          "Implement environment toggle VITE_USE_MOCK=true to serve synthetic heuristic scoring directly in the browser while supporting live GCS model loading in Firebase Functions.",
        prompt:
          "export async function classifyArticle(text: string) {\n  if (import.meta.env.VITE_USE_MOCK === 'true') {\n    return mockClassify(text); // Zero latency, ₹0 infrastructure spend\n  }\n  return fetch('/api/classify', { method: 'POST', body: JSON.stringify({ text }) });\n}",
      },
    ],

    whereItBroke: {
      tell: "Model achieved 99% test accuracy on train sets but dropped significantly on newly written contemporary news articles.",
      breakdown:
        "The ISOT dataset used for initial training had source-style leakage: fake articles had distinct capitalization quirks and specific outlet signatures that the model memorized as shortcuts rather than learning semantic fakeness.",
      solution:
        "Standardized text preprocessing to strip source metadata, capitalized headline artifacts, and publisher tags. Documented the known dataset distribution limits explicitly in the UI and roadmap rather than presenting an artificial 99% accuracy claim.",
    },

    costBreakdown: [
      {
        item: "React 19 & Vite",
        cost: "₹0",
        note: "Open-source frontend hosted on GitHub Pages / Vercel Hobby",
      },
      {
        item: "scikit-learn & Python",
        cost: "₹0",
        note: "Open-source BSD-3-clause machine learning suite",
      },
      {
        item: "Firebase Free Spark Plan",
        cost: "₹0",
        note: "Free tier covers Firestore reads/writes and storage",
      },
      {
        item: "Mock-Mode Client Engine",
        cost: "₹0",
        note: "Zero-cloud demo mode ensures permanent ₹0 maintenance cost",
      },
      {
        item: "Tailwind CSS v4 & Fonts",
        cost: "₹0",
        note: "Google Fonts Playfair Display & open-source styling",
      },
    ],

    makeItYours: [
      "Academic Paper Citation Authenticity Checker: Analyzes bibliography formatting and DOI patterns in research papers to flag predatory journal citations.",
      "Phishing Email Red-Flag Scanner: Scans incoming emails for urgent manipulative language, mismatched sender signatures, and dubious links.",
      "Victorian Era Sentiment Classifier: Analyzes modern user reviews and re-expresses sentiment analysis using 19th-century prose aesthetics.",
    ],
  },
  {
    slug: "tiffinly-tiffin-order-tracker-pwa",
    title: "Tiffinly — First Tiffin Order Tracker & Offline-First WhatsApp Ledger",
    oneLine:
      "An offline-first Progressive Web App that turns informal WhatsApp group chat exports into a structured, queryable meal delivery and payment ledger using local IndexedDB.",
    shipped: "2026-08-30",
    updated: "2026-08-30",
    minutes: 90,
    tools: ["React 18", "Dexie.js", "IndexedDB", "Tailwind CSS", "Vite PWA"],
    codeWritten: true,
    liveUrl: "https://tiffinly.algobic.in",
    builder: "LogixLoops",
    cost: 0,
    difficulty: "first-build",

    whatItDoes:
      "Daily meal tracking (breakfast/lunch/dinner, marked ordered/skipped) feeds an interactive monthly calendar view, spending analytics, and payment status tracking. The standout capability is WhatsApp import: export an informal tiffin group chat log, paste it into the built-in parser, and Tiffinly extracts and auto-detects meal orders, cancellations, and prices from unstructured text — creating an instant verifiable ledger without requiring the tiffin vendor to change their operations. All data is persisted client-side in IndexedDB via Dexie.js, making the app 100% offline-functional and installable as a native PWA on iOS, Android, and desktop.",

    whyItMatters:
      "Informal recurring service arrangements across India and South Asia (tiffin meals, laundry, daily milk delivery) operate almost entirely inside scattered WhatsApp group chats without any formal record-keeping layer. Customers either lose track of monthly totals or spend hours manually scrolling back to tally up payments. An offline-first PWA is the ideal architecture: zero backend maintenance, zero login barrier, zero recurring cloud costs, and flawless functionality even in basements and dorms with spotty connectivity.",

    highlights: [
      "Custom WhatsApp chat-export parser (regex heuristics extracting meal types, quantities, and dates from informal conversational syntax)",
      "100% Offline-First architecture: client-side IndexedDB via Dexie.js as the primary source of truth",
      "Unified multi-source schema: cleanly reconciles manual calendar entries and chat-imported records via provenance tracking",
      "PWA installation package with offline service workers, web app manifests, and home-screen icon support across iOS and Android",
      "Monthly spending analytics and payment reconciliation visualizer powered by Recharts",
    ],

    useCases: [
      "College students and hostel residents tracking daily mess/tiffin subscription expenses",
      "Informal recurring service tracking (local laundry pick-ups, daily newspaper/milk subscriptions)",
      "Small residential tiffin providers keeping a lightweight, offline customer order ledger",
      "Personal expense accountability and budgeting for shared flat/roommate meal splits",
    ],

    architecture: [
      {
        step: "01 / Input & Ingestion",
        tool: "WhatsApp Chat Parser",
        role: "Regex state machine parsing timestamps, sender names, and keywords ('1 lunch', 'skip dinner', 'half plate') from exported text logs",
      },
      {
        step: "02 / Normalization",
        tool: "Meal Ledger Engine",
        role: "Maps parsed tokens into structured Order objects with meal type, date, price, and provenance ('manual' vs 'whatsapp_import')",
      },
      {
        step: "03 / Persistence",
        tool: "Dexie.js (IndexedDB)",
        role: "Local client-side database with reactive live queries across Orders, Settings, and Payments tables",
      },
      {
        step: "04 / Analytics",
        tool: "Recharts Visualizer",
        role: "Generates monthly spend breakdowns, unpaid balance summaries, and skipped meal savings metrics",
      },
      {
        step: "05 / Offline App",
        tool: "Vite PWA Plugin",
        role: "Service worker asset caching and Web App Manifest for native home-screen installation",
      },
    ],

    thePath: [
      {
        step: 1,
        title: "Building the WhatsApp Chat Export Regex Parser",
        detail:
          "Write a robust parser supporting 12-hour and 24-hour timestamp variations across iOS and Android exports, detecting meal intent keywords and cancellation markers.",
        prompt:
          "const WA_REGEX = /^(?:\\[?(\\d{1,2}\\/\\d{1,2}\\/\\d{2,4}),?\\s+(\\d{1,2}:\\d{2}(?::\\d{2})?\\s*(?:[ap]m)?)\\]?\\s*(?:-|:)?\\s*([^:]+):\\s*(.*)$/i;\n// Extract date, sender, and message; match keywords: 'lunch', 'dinner', 'roti', 'extra', 'cancel', 'skip'",
      },
      {
        step: 2,
        title: "Configuring Dexie.js Client-Side Schema",
        detail:
          "Define the local IndexedDB database schema with indexed keys on date, mealType, paymentStatus, and source for rapid calendar lookups.",
        prompt:
          "export class TiffinDatabase extends Dexie {\n  orders!: Table<Order>;\n  payments!: Table<Payment>;\n  settings!: Table<Settings>;\n  constructor() {\n    super('TiffinlyDB');\n    this.version(1).stores({\n      orders: '++id, date, mealType, status, source',\n      payments: '++id, date, amount, method',\n      settings: 'key'\n    });\n  }\n}",
      },
      {
        step: 3,
        title: "Creating the Interactive Calendar & Ledger UI",
        detail:
          "Build month-view and week-view meal toggles allowing one-click switching between Ordered, Skipped, and Extra across breakfast, lunch, and dinner.",
        prompt:
          "// Render interactive day cell with meal pills\n<div className='p-2 border rounded'>\n  <span className='font-mono'>{dayNumber}</span>\n  <MealPill type='lunch' status={order?.lunch} onToggle={() => toggleMeal(date, 'lunch')} />\n  <MealPill type='dinner' status={order?.dinner} onToggle={() => toggleMeal(date, 'dinner')} />\n</div>",
      },
      {
        step: 4,
        title: "PWA Service Worker & Manifest Configuration",
        detail:
          "Configure Vite PWA plugin with CacheFirst strategies for static assets and local storage fallback, enabling native standalone execution without network access.",
        prompt:
          "VitePWA({\n  registerType: 'autoUpdate',\n  manifest: { name: 'Tiffinly', short_name: 'Tiffinly', theme_color: '#ea580c', display: 'standalone' },\n  workbox: { globPatterns: ['**/*.{js,css,html,ico,png,svg}'] }\n})",
      },
    ],

    whereItBroke: {
      tell: "WhatsApp exports from Android and iOS used completely different timestamp formats (brackets vs. hyphens, 12h AM/PM vs. 24h military time), breaking chat ingestion for half the test users.",
      breakdown:
        "iOS exports formatted lines as '[15/08/24, 1:30:15 PM] Name: Message' while Android formatted as '15/08/24, 13:30 - Name: Message'. A rigid single regex crashed when parsing the opposite platform.",
      solution:
        "Built a multi-pattern regex fallback tokenizer that inspects the first 5 lines of the chat log to auto-detect platform dialect (iOS bracketed vs. Android hyphenated) before executing the batch parser.",
    },

    costBreakdown: [
      {
        item: "React 18 & Vite",
        cost: "₹0",
        note: "Open-source frontend hosted on GitHub Pages",
      },
      {
        item: "Dexie.js (IndexedDB)",
        cost: "₹0",
        note: "Zero-cloud local client-side storage library",
      },
      {
        item: "Vite PWA Plugin",
        cost: "₹0",
        note: "Zero-cost service worker caching and native manifest generation",
      },
      {
        item: "Tailwind CSS & Lucide Icons",
        cost: "₹0",
        note: "Open-source design system",
      },
      {
        item: "Recharts Library",
        cost: "₹0",
        note: "Open-source SVG data visualization suite",
      },
    ],

    makeItYours: [
      "Daily Milk & Dairy Delivery Ledger: Tracks daily milk literage, curd, and butter orders with monthly invoice reconciliation.",
      "Hostel Laundry Service Tracker: Logs clothes dropped off, returned item counts, and ironed vs. washed rates.",
      "Shared Flat Grocery Splitter: Parses shared apartment WhatsApp notes to tally who bought groceries and calculates end-of-month settlement totals.",
    ],
  },
  {
    slug: "alphamind-quantitative-stock-analysis",
    title: "AlphaMind — Quantitative & Fundamental Stock Analysis Platform",
    oneLine:
      "A full-stack equity research platform combining technical indicators with a 6-tier algebraic fundamental derivation cascade to handle missing financial API data for NSE and global markets.",
    shipped: "2026-08-30",
    updated: "2026-08-30",
    minutes: 210,
    tools: ["FastAPI", "SQLAlchemy", "Pandas", "ReportLab", "React 19"],
    codeWritten: true,
    liveUrl: "https://alphamind.algobic.in",
    builder: "LogixLoops",
    cost: 0,
    difficulty: "second",

    whatItDoes:
      "Given any stock symbol, AlphaMind computes technical signals (14-period RSI, SMA 50/200 golden/death-crosses, 6-month momentum, volume breakout ratios) and fundamental health metrics, fusing them into a single weighted recommendation (60% fundamental / 40% technical → Strong Buy through Avoid). To resolve the pervasive issue of free-tier financial APIs returning 0.0% or null on mid/small-cap fundamentals, AlphaMind executes a 6-tier mathematical derivation cascade: live API data → verified static NSE blue-chip catalog → algebraic derivation from (P/B) / (P/E) → derivation from EPS and Book Value → derivation from ROA scaled by leverage → operating margin approximations. It also generates publication-grade PDF research digests and invoices using custom two-pass ReportLab canvases for exact page numbering.",

    whyItMatters:
      "Free financial data feeds (like yfinance and Finnhub) are notoriously incomplete precisely where retail investors need analysis most — on smaller and mid-cap equities. Rather than silently passing broken zeroes into scoring models, AlphaMind implements rigorous quantitative accounting math to back-calculate missing balance sheet metrics. It demonstrates true domain engineering: structured FastAPI architecture (service layers, OAuth2 JWT auth, Alembic migrations), two-pass PDF rendering, and clear financial disclaimer boundaries.",

    highlights: [
      "6-tier algebraic fallback cascade deriving missing ROE and financial ratios when free API feeds return null: (P/B) / (P/E) = EPS / Book Value = ROE",
      "Blended recommendation engine combining 60% fundamental health + 40% technical momentum into 5-tier actionable signals",
      "Two-pass ReportLab PDF generation engine with dynamic 'Page X of Y' canvas numbering for weekly market digests",
      "Production-grade FastAPI backend with OAuth2/JWT auth, bcrypt password hashing, SQLAlchemy models, and Alembic migrations",
      "Real-time technical indicator computation engine (14-period RSI, SMA 50/200 crossovers, 6-month momentum, volume surges)",
    ],

    useCases: [
      "Retail equity research and quantitative screener for NSE and international equities",
      "Automated weekly investment digest and portfolio audit report generation",
      "Reference architecture for building resilient data ingestion pipelines around flaky third-party APIs",
      "Educational benchmark for exploring fundamental valuation modeling and technical crossover strategies",
    ],

    architecture: [
      {
        step: "01 / Ingestion",
        tool: "yfinance & Finnhub",
        role: "Fetches OHLCV price histories, market cap, and preliminary financial statements via asynchronous workers",
      },
      {
        step: "02 / Derivation",
        tool: "6-Tier Cascade Engine",
        role: "Algebraically back-calculates missing ROE, EPS, and leverage metrics through accounting formula fallbacks",
      },
      {
        step: "03 / Technicals",
        tool: "Pandas & NumPy",
        role: "Computes 14-day RSI, 50/200 SMA crossovers, MACD, and historical volatility bands",
      },
      {
        step: "04 / Synthesis",
        tool: "Alpha Scoring Core",
        role: "Calculates 60/40 blended fundamental-technical rating matrix (Strong Buy to Avoid)",
      },
      {
        step: "05 / Publishing",
        tool: "ReportLab & React 19",
        role: "Two-pass PDF research digest generator + modern React 19 / TypeScript equity dashboard",
      },
    ],

    thePath: [
      {
        step: 1,
        title: "Building the 6-Tier Algebraic Fundamental Derivation Cascade",
        detail:
          "Implement the resilient fallback cascade to calculate ROE and financial health ratios when API providers return missing fields.",
        prompt:
          "def derive_roe(data: dict) -> float:\n    if data.get('roe'): return data['roe']\n    if pb := data.get('pb_ratio') and (pe := data.get('pe_ratio')) and pe > 0:\n        return pb / pe  # (Price/Book) / (Price/EPS) = EPS/Book = ROE\n    if eps := data.get('eps') and (bv := data.get('book_value')) and bv > 0:\n        return eps / bv\n    if roa := data.get('roa') and (lev := data.get('leverage_ratio')):\n        return roa * lev\n    return fallback_catalog.get(data['symbol'], {}).get('roe', 0.0)",
      },
      {
        step: 2,
        title: "Technical Signal Engine in Pandas & NumPy",
        detail:
          "Write vectorized technical calculation routines for 14-period RSI, exponential moving averages, golden/death-cross triggers, and volume breakout factors.",
        prompt:
          "def compute_technicals(df: pd.DataFrame) -> dict:\n    delta = df['Close'].diff()\n    gain = delta.where(delta > 0, 0).rolling(14).mean()\n    loss = (-delta.where(delta < 0, 0)).rolling(14).mean()\n    rs = gain / (loss + 1e-9)\n    rsi = 100 - (100 / (1 + rs))\n    sma_50 = df['Close'].rolling(50).mean()\n    sma_200 = df['Close'].rolling(200).mean()\n    return {'rsi': rsi.iloc[-1], 'golden_cross': sma_50.iloc[-1] > sma_200.iloc[-1]}",
      },
      {
        step: 3,
        title: "Two-Pass Numbered PDF Canvas in ReportLab",
        detail:
          "Create a custom ReportLab canvas class that intercepts draw operations to calculate total page count dynamically for professional 'Page X of Y' footers.",
        prompt:
          "class NumberedCanvas(canvas.Canvas):\n    def __init__(self, *args, **kwargs):\n        super().__init__(*args, **kwargs)\n        self._saved_page_states = []\n    def showPage(self):\n        self._saved_page_states.append(dict(self.__dict__))\n        self._startPage()\n    def save(self):\n        num_pages = len(self._saved_page_states)\n        for state in self._saved_page_states:\n            self.__dict__.update(state)\n            self.draw_page_number(num_pages)\n            super().showPage()\n        super().save()",
      },
      {
        step: 4,
        title: "FastAPI Service Architecture with JWT & Alembic",
        detail:
          "Structure the backend into providers, services, schemas, and SQLAlchemy ORM models with Alembic versioning for user portfolios and watchlists.",
        prompt:
          "app = FastAPI(title='AlphaMind Engine')\napp.include_router(auth_router, prefix='/api/auth')\napp.include_router(analysis_router, prefix='/api/stocks')\napp.include_router(digest_router, prefix='/api/reports')",
      },
    ],

    whereItBroke: {
      tell: "Mid-cap and small-cap stocks frequently displayed 0.0% ROE and broken valuation scores despite having healthy historical earnings.",
      breakdown:
        "Free-tier financial APIs return empty strings or 0.0 for balance sheet items on non-S&P500 / non-NIFTY50 tickers, which raw scoring algorithms interpreted as total insolvency.",
      solution:
        "Constructed the 6-tier algebraic derivation cascade that back-calculates ROE from P/B and P/E ratios and fallback catalogs before passing data to the scoring engine.",
    },

    costBreakdown: [
      {
        item: "FastAPI & Python Stack",
        cost: "₹0",
        note: "Open-source asynchronous backend framework",
      },
      {
        item: "yfinance & Finnhub",
        cost: "₹0",
        note: "Free-tier market data API endpoints (60 calls/min)",
      },
      {
        item: "SQLAlchemy & SQLite/Postgres",
        cost: "₹0",
        note: "Open-source relational database layer",
      },
      {
        item: "ReportLab Open Source",
        cost: "₹0",
        note: "Free LGPL PDF generation library",
      },
      {
        item: "React 19 & Tailwind CSS v4",
        cost: "₹0",
        note: "Open-source web application interface",
      },
    ],

    makeItYours: [
      "Crypto On-Chain & Technical Screener: Replaces equities with decentralized exchange token liquidity and wallet accumulation signals.",
      "Commodity Futures Margin & Spread Calculator: Computes carry costs, seasonality curves, and term-structure contango/backwardation spreads.",
      "SaaS Company Metric Benchmark Dashboard: Computes Rule of 40, CAC payback period, and Net Revenue Retention cascades from self-reported financials.",
    ],
  },
  {
    slug: "ai-terminal-assistant",
    title: "AI Terminal Assistant — Foundational CLI Conversational System",
    oneLine:
      "A lightweight terminal-based conversational assistant in Python implementing rule-based intent routing, dynamic web automation actions, and graceful search fallback loops.",
    shipped: "2026-08-30",
    updated: "2026-08-30",
    minutes: 45,
    tools: ["Python", "Webbrowser", "OS & Sys", "Regex Intent"],
    codeWritten: true,
    liveUrl: "https://terminal-ai.algobic.in",
    builder: "LogixLoops",
    cost: 0,
    difficulty: "first-build",

    whatItDoes:
      "Takes text input from the user in a terminal interface and responds through layered interaction patterns: conversational dialogue (mood check-ins, motivation, empathy responses), system diagnostics, and direct automation actions — launching target platforms like Netflix, Spotify, Google, and email clients on demand. When a query falls outside predefined action trees, the assistant gracefully redirects the search query to a live Google search rather than failing silently, ensuring the user always reaches a useful outcome.",

    whyItMatters:
      "Every complex agent architecture begins with the fundamental loop: Input → Intent Classification → Action Execution / Dialogue Response → Fallback Grace. This build serves as the essential beginner reference for understanding conversational systems from first principles in standard Python without external cloud dependencies, establishing the foundational mental model before layering in LLMs, tool-calling chains, or vector stores.",

    highlights: [
      "Zero-dependency architecture: runs on standard Python standard library (sys, os, webbrowser, re, datetime)",
      "Layered intent dispatcher separating conversational greetings, mood tracking, and direct desktop/web automation",
      "Graceful search fallback loop preventing dead-end errors by redirecting unhandled queries to Google Search",
      "Direct application launching for Spotify, Netflix, Google Workspace, and email clients via native OS hooks",
      "Clean starting baseline for extending into modern NLP libraries and local LLM tool calling",
    ],

    useCases: [
      "First-principles educational baseline for learning conversational agent design in Python",
      "Quick-access terminal command launcher and workflow automation helper",
      "Lightweight desktop companion for rapid search queries and app launching without browser clutter",
      "Starting template for integrating speech recognition (STT) and text-to-speech (TTS) peripherals",
    ],

    architecture: [
      {
        step: "01 / Input Loop",
        tool: "Python CLI REPL",
        role: "Continuous terminal input read loop with sanitization and lowercase normalization",
      },
      {
        step: "02 / Intent Match",
        tool: "Regex Pattern Matcher",
        role: "Categorizes user input into greeting, mood, action command, or unhandled query",
      },
      {
        step: "03 / Action",
        tool: "Webbrowser & OS",
        role: "Executes local OS launch hooks and automated browser navigation to Spotify, Netflix, etc.",
      },
      {
        step: "04 / Fallback",
        tool: "Search Redirector",
        role: "Constructs encoded Google Search query URLs for queries outside intent vocabulary",
      },
      {
        step: "05 / Output",
        tool: "ANSI Colored Terminal",
        role: "Formats styled terminal responses and conversational feedback strings",
      },
    ],

    thePath: [
      {
        step: 1,
        title: "Building the Interactive CLI REPL Loop",
        detail:
          "Set up the main conversation loop in Python with keyboard interrupt handling, prompt formatting, and input normalization.",
        prompt:
          "def main_loop():\n    print('AI Assistant initialized. Type \"quit\" to exit.')\n    while True:\n        try:\n            user_input = input('You: ').strip().lower()\n            if user_input in ['quit', 'exit', 'bye']:\n                break\n            handle_input(user_input)\n        except KeyboardInterrupt:\n            break",
      },
      {
        step: 2,
        title: "Pattern-Based Intent Routing & Response Trees",
        detail:
          "Write regex intent matching routines that differentiate between conversational statements (mood, greetings) and executable action commands.",
        prompt:
          "INTENTS = {\n    'greeting': r'\\b(hi|hello|hey|good morning)\\b',\n    'mood': r'\\b(how are you|feeling|sad|happy|tired)\\b',\n    'action_app': r'\\b(open|launch|play)\\s+(spotify|netflix|youtube|google|mail)\\b'\n}",
      },
      {
        step: 3,
        title: "Implementing Web & Desktop Automation Hooks",
        detail:
          "Use the standard library webbrowser module to map platform keywords to direct URL schemes and system actions.",
        prompt:
          "APP_URLS = {\n    'spotify': 'https://open.spotify.com',\n    'netflix': 'https://www.netflix.com',\n    'youtube': 'https://www.youtube.com',\n    'mail': 'https://mail.google.com'\n}\ndef launch_app(app_name):\n    if url := APP_URLS.get(app_name):\n        webbrowser.open(url)\n        print(f'Assistant: Launching {app_name}...')",
      },
      {
        step: 4,
        title: "Graceful Search Fallback Mechanism",
        detail:
          "Ensure unhandled queries never crash or fail silently by constructing safe URL-encoded web queries.",
        prompt:
          "def fallback_search(query: str):\n    encoded_query = urllib.parse.quote_plus(query)\n    search_url = f'https://www.google.com/search?q={encoded_query}'\n    webbrowser.open(search_url)\n    print(f'Assistant: I searched Google for \"{query}\"')",
      },
    ],

    whereItBroke: {
      tell: "Typing multi-word queries like 'how is the weather in Delhi' resulted in a dead-end 'Command not recognized' error string.",
      breakdown:
        "Rigid keyword matching only checked exact phrase dictionaries, causing any open-ended conversational query to hit an unhelpful dead-end error message.",
      solution:
        "Replaced dead-end error returns with an automatic search fallback loop that URL-encodes the query and opens Google in the user's default browser, keeping the user workflow continuous.",
    },

    costBreakdown: [
      {
        item: "Python 3 Standard Library",
        cost: "₹0",
        note: "Zero external dependencies or pip packages required",
      },
      {
        item: "Webbrowser & OS Modules",
        cost: "₹0",
        note: "Built directly into core Python runtime",
      },
      {
        item: "Local Terminal Environment",
        cost: "₹0",
        note: "Runs locally on any OS (macOS, Linux, Windows)",
      },
      {
        item: "Google Search URL Scheme",
        cost: "₹0",
        note: "Zero-cost browser query redirect",
      },
    ],

    makeItYours: [
      "Local Note Taking & Todo CLI: Adds commands to append, search, and list markdown notes in a local ~/.notes directory.",
      "Developer Git & Workspace Setup Helper: Automates opening pull requests, running test suites, and setting up daily dev tabs.",
      "Voice-Enabled Terminal Assistant: Adds speech_recognition and pyttsx3 modules for hands-free desktop voice control.",
    ],
  },
  {
    slug: "ai-finance-manager-receipt-scanner",
    title: "AI Finance Manager — Personal Finance Tracker with Automated Receipt Scanning",
    oneLine:
      "A full-stack personal finance platform combining multimodal Gemini receipt scanning with Inngest background event jobs, Arcjet rate-limiting, and automated Resend email digests.",
    shipped: "2026-08-30",
    updated: "2026-08-30",
    minutes: 240,
    tools: ["Next.js 15", "Gemini Vision", "Prisma", "Inngest", "Arcjet", "Resend"],
    codeWritten: true,
    liveUrl: "https://finance.algobic.in",
    builder: "LogixLoops",
    cost: 0,
    difficulty: "second",

    whatItDoes:
      "Users manage multiple accounts (current, savings), track cashflow, and establish dynamic monthly budget thresholds. The core differentiator is multimodal receipt extraction: upload or photograph a physical receipt, and Gemini 2.0 Flash extracts the total amount, purchase date, merchant name, line items, and expense category automatically into structured Prisma database entries without manual typing. Recurring transaction cycles, monthly budget-limit evaluations, and personalized financial health digests run as asynchronous background jobs via Inngest. Budget threshold alerts and monthly financial reports are composed with React Email and delivered via Resend.",

    whyItMatters:
      "Manual data entry is the primary failure mode of personal budgeting tools — the friction of typing in every grocery slip or coffee receipt causes user abandonment within weeks. Automating data capture with vision models directly solves the product's highest friction point rather than tacking on an unrelated chatbot. Backed by Inngest event queues, Clerk authentication, and Arcjet shield rate-limiting, it represents a production-grade blueprint for modern AI-driven financial SaaS.",

    highlights: [
      "Multimodal Gemini 2.0 vision extraction transforming raw camera receipt photos into validated JSON transactions",
      "Asynchronous background job engine (Inngest) managing recurring expenses, monthly rollover audits, and budget threshold checks",
      "Edge security & bot protection via Arcjet rate limiting and shield rules layered with Clerk authentication",
      "Transactional email pipeline (React Email + Resend) dispatching automated budget breach alerts and monthly PDF-style digests",
      "Next.js 15 App Router architecture with Prisma ORM, Neon serverless PostgreSQL, and Shadcn UI components",
    ],

    useCases: [
      "Personal expense tracking and zero-friction receipt archival for freelancers and professionals",
      "Family & household budget management across multiple bank accounts and debit cards",
      "Small business expense reporting and tax categorization for paper receipt compliance",
      "Reference architecture for building resilient event-driven AI SaaS apps with background queues",
    ],

    architecture: [
      {
        step: "01 / Capture",
        tool: "Next.js 15 Dropzone",
        role: "Client-side image compression and secure upload to temporary server action pipeline",
      },
      {
        step: "02 / Extraction",
        tool: "Gemini 2.0 Vision",
        role: "Multimodal OCR and structured JSON schema extraction (amount, merchant, date, category, tax)",
      },
      {
        step: "03 / Database",
        tool: "Prisma & PostgreSQL",
        role: "Relational transaction storage, account balance updates, and foreign key integrity",
      },
      {
        step: "04 / Async Jobs",
        tool: "Inngest Event Bus",
        role: "Background cron workers for recurring debits, monthly budget rollover, and threshold monitoring",
      },
      {
        step: "05 / Dispatch & Guard",
        tool: "Arcjet & Resend",
        role: "Token bucket rate limiting on receipt parsing endpoints + React Email budget alert dispatches",
      },
    ],

    thePath: [
      {
        step: 1,
        title: "Prompting Gemini 2.0 Vision for Structured Receipt Extraction",
        detail:
          "Write a structured system prompt forcing Gemini 2.0 Flash to inspect receipt photos and output strict JSON with merchant, total, date, category, and line items.",
        prompt:
          "const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });\nconst result = await model.generateContent([\n  { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },\n  'Extract receipt details into strict JSON: { merchantName: string, amount: number, date: ISOString, category: ExpenseCategory, confidence: number }'\n]);",
      },
      {
        step: 2,
        title: "Prisma Data Modeling & Account Balance Sync",
        detail:
          "Define PostgreSQL schemas for User, Account, Transaction, and Budget models, wrapping transaction creation in ACID database transactions.",
        prompt:
          "await prisma.$transaction(async (tx) => {\n  const txn = await tx.transaction.create({ data: { accountId, amount, merchantName, category, date } });\n  await tx.account.update({ where: { id: accountId }, data: { balance: { decrement: amount } } });\n  return txn;\n});",
      },
      {
        step: 3,
        title: "Configuring Inngest Event-Driven Background Workers",
        detail:
          "Set up Inngest serverless functions for processing recurring subscription entries on schedule and firing budget alerts when spending exceeds 85% of target.",
        prompt:
          "export const checkBudgetLimits = inngest.createFunction(\n  { id: 'check-budget-limits' },\n  { event: 'transaction.created' },\n  async ({ event, step }) => {\n    const budget = await step.run('fetch-budget', () => getBudget(event.data.userId));\n    if (budget.spentPercentage >= 0.85) {\n      await step.run('send-alert', () => resend.emails.send({ ... }));\n    }\n  }\n);",
      },
      {
        step: 4,
        title: "Endpoint Hardening with Arcjet Rate Limiting",
        detail:
          "Shield AI scanning API routes against abuse using Arcjet token bucket rate limits (10 scans/hour per IP) and bot detection rules.",
        prompt:
          "const aj = arcjet({\n  key: process.env.ARCJET_KEY!,\n  rules: [tokenBucket({ mode: 'LIVE', characteristics: ['userId'], refillRate: 10, interval: 3600, capacity: 10 })]\n});",
      },
    ],

    whereItBroke: {
      tell: "Creased or thermal receipts with faint text frequently caused the model to hallucinate missing total amounts or confuse total with subtotal.",
      breakdown:
        "When receipt paper had folds or faint thermal printing, raw single-prompt extraction misidentified tax or discount lines as the final payable amount.",
      solution:
        "Implemented a multi-line mathematical reconciliation validator in the prompt and backend: the engine sums extracted individual line items against the parsed total, prompting the user for confirmation only if the arithmetic difference exceeds ₹5.",
    },

    costBreakdown: [
      {
        item: "Next.js 15 & Vercel",
        cost: "₹0",
        note: "Hobby deployment on Vercel with free edge runtime",
      },
      {
        item: "Neon Serverless PostgreSQL",
        cost: "₹0",
        note: "Free tier 0.5GB database storage",
      },
      {
        item: "Google Gemini API",
        cost: "₹0",
        note: "Free tier (15 RPM / 1M TPM) covers receipt image analysis",
      },
      {
        item: "Inngest Cloud",
        cost: "₹0",
        note: "Free tier (25,000 monthly background step executions)",
      },
      {
        item: "Clerk & Arcjet & Resend",
        cost: "₹0",
        note: "Free tiers (10k MAU, 3k emails/mo, 100k requests/mo)",
      },
    ],

    makeItYours: [
      "Freelance Invoice & Tax Deduction Tracker: Automatically extracts GST / VAT numbers and generates quarterly expense reports.",
      "Corporate Travel & Per-Diem Mileage Reconciler: Matches hotel, meal, and flight receipts against company travel policy allowances.",
      "Split-Bill Apartment Expense Ledger: Scans group restaurant bills, calculates itemized tip/tax shares, and sends WhatsApp payment links.",
    ],
  },
  {
    slug: "mule-account-detection-pipeline",
    title: "Mule Account Detection — Money Laundering Detection Pipeline",
    oneLine:
      "An end-to-end AML fraud pipeline processing 400M+ banking transactions across 187 engineered features with LightGBM and XGBoost gradient-boosted ensembles (0.9830 AUC-ROC).",
    shipped: "2026-08-30",
    updated: "2026-08-30",
    minutes: 270,
    tools: ["LightGBM", "XGBoost", "PyArrow", "Pandas", "Scikit-Learn"],
    codeWritten: true,
    liveUrl: "https://mule-aml.algobic.in",
    builder: "LogixLoops",
    cost: 0,
    difficulty: "harder",

    whatItDoes:
      "Processes a 16GB+ banking dataset covering ~400 million transactions over a 5-year window across customer KYC, account, branch, and product tables. Computes 187 engineered behavioral and graph-level features (inbound-to-outbound velocity, burst ratios, rapid fund dissipation, geographic branch anomalies) feeding two independent gradient-boosted models (LightGBM and XGBoost) combined in an ensemble. Trained on 96,091 labeled accounts under a realistic 2.8% positive class imbalance, scoring 64,062 held-out test accounts to output calibrated mule-probability scores and suspicious-activity time windows.",

    whyItMatters:
      "Mule accounts (compromised or complicit accounts used to receive and rapidly dissipate stolen funds) are the operational backbone of money laundering networks. This project tackles real-world Anti-Money Laundering (AML) challenges at scale: multi-table relational schema joins over 400M rows with PyArrow, heavy class imbalance (2.8%), deliberate label noise injection, and rigorous temporal validation preventing post-hoc leakage (verifying features derive strictly from transaction behavior prior to freeze/flag dates). Both models achieve 0.982+ AUC-ROC, with optimal F1 thresholding at 0.82.",

    highlights: [
      "187 engineered features across 400M+ transactions: velocity ratios, dormance-to-burst shifts, and rapid round-trip dissipation metrics",
      "Multi-table PyArrow & Parquet memory-efficient pipeline joining customer KYC, multi-account, and branch tables",
      "Dual gradient-boosted models compared: LightGBM (0.9822 AUC) and XGBoost (0.9827 AUC) with ensemble reaching 0.9830 AUC",
      "Optimal F1 threshold calibration (threshold = 0.82) specifically tuned for 2.8% positive class imbalance",
      "Strict leakage audits: verifies all temporal features exclude post-hoc metadata (freeze dates, investigative tags)",
    ],

    useCases: [
      "Bank & FinTech transaction monitoring for automated suspicious activity report (SAR) prioritization",
      "Peer-to-peer payment gateway fraud detection for instant account freeze recommendations",
      "Cryptocurrency on-ramp/off-ramp fiat layering detection and mule ring identification",
      "Reference architecture for scalable tabular feature engineering over 100M+ row relational data",
    ],

    architecture: [
      {
        step: "01 / Ingestion",
        tool: "PyArrow Parquet Pipeline",
        role: "Chunked streaming and columnar storage of 400M+ transactions across 5 relational tables",
      },
      {
        step: "02 / Feature Engine",
        tool: "Pandas & NumPy Vectorizer",
        role: "Computes 187 behavioral features: velocity, nocturnal transfers, dormant-to-active burst ratios",
      },
      {
        step: "03 / Models",
        tool: "LightGBM & XGBoost",
        role: "Dual gradient-boosted trees trained with early stopping, scale_pos_weight, and stratified K-fold cross validation",
      },
      {
        step: "04 / Ensemble",
        tool: "Weighted Soft Voting",
        role: "Combines calibrated probability outputs from LightGBM and XGBoost into final mule confidence score",
      },
      {
        step: "05 / Threshold",
        tool: "F1 Precision-Recall Optimizer",
        role: "Calibrates decision boundary at 0.82 to balance false positives against missed high-risk laundered sums",
      },
    ],

    thePath: [
      {
        step: 1,
        title: "Streaming Multi-Table Joins with PyArrow & Parquet",
        detail:
          "Design memory-efficient chunked readers to join 400M transaction records with customer demographics, account opening channels, and branch telemetry.",
        prompt:
          "import pyarrow.parquet as pq\nimport pyarrow.compute as pc\n# Read dataset in 500k-row batches to maintain under 8GB RAM footprint\nfor batch in pq.ParquetFile('transactions.parquet').iter_batches(batch_size=500_000):\n    df_batch = batch.to_pandas()\n    df_features = extract_velocity_features(df_batch)",
      },
      {
        step: 2,
        title: "Engineering the 187-Feature Behavioral AML Matrix",
        detail:
          "Construct temporal features measuring rapid fund pass-through: time-to-dissipation (minutes between deposit and withdrawal), round-amount ratios, and counterpart entropy.",
        prompt:
          "def calculate_mule_signals(account_txns):\n    deposit_vol = account_txns[account_txns['type'] == 'CR']['amount'].sum()\n    withdrawal_vol = account_txns[account_txns['type'] == 'DR']['amount'].sum()\n    pass_through_ratio = min(deposit_vol, withdrawal_vol) / (max(deposit_vol, withdrawal_vol) + 1e-5)\n    time_diffs = account_txns['timestamp'].diff().dt.total_seconds().dropna()\n    rapid_turnaround = (time_diffs < 1800).mean() # Txns under 30 mins\n    return {'pass_through_ratio': pass_through_ratio, 'rapid_turnaround': rapid_turnaround}",
      },
      {
        step: 3,
        title: "Training LightGBM and XGBoost with Imbalance Tuning",
        detail:
          "Train gradient-boosted models with stratified cross-validation, using scale_pos_weight and Focal Loss heuristics to handle the 2.8% positive class imbalance.",
        prompt:
          "lgb_train = lgb.Dataset(X_train, label=y_train)\nparams = {\n    'objective': 'binary',\n    'metric': 'auc',\n    'scale_pos_weight': (1 - 0.028) / 0.028,\n    'learning_rate': 0.03,\n    'num_leaves': 63,\n    'feature_fraction': 0.8\n}\nmodel_lgb = lgb.train(params, lgb_train, num_boost_round=1500, valid_sets=[lgb_val], callbacks=[lgb.early_stopping(50)])",
      },
      {
        step: 4,
        title: "Ensemble Calibration and F1 Threshold Selection",
        detail:
          "Blend predictions using weighted soft voting and evaluate precision-recall curves to identify the 0.82 decision threshold maximizing F1 score.",
        prompt:
          "pred_ensemble = 0.5 * pred_lgb + 0.5 * pred_xgb\nprecisions, recalls, thresholds = precision_recall_curve(y_test, pred_ensemble)\nf1_scores = 2 * (precisions * recalls) / (precisions + recalls + 1e-9)\nbest_threshold = thresholds[np.argmax(f1_scores)] # 0.82",
      },
    ],

    whereItBroke: {
      tell: "Initial model runs scored an impossible 0.9998 AUC-ROC, alerting the team to catastrophic feature leakage.",
      breakdown:
        "The raw dataset contained an 'account_status_change_date' column. When an account was frozen by compliance, this date was populated. The model learned to identify mules solely by checking if a status change date existed, completely ignoring actual transaction patterns.",
      solution:
        "Purged all post-investigation administrative columns from the feature matrix. Rewrote the feature pipeline to enforce strict temporal cutoff windows: only transactions occurring strictly BEFORE the first compliance review timestamp were permitted in feature generation, yielding a realistic 0.9830 AUC-ROC.",
    },

    costBreakdown: [
      {
        item: "LightGBM & XGBoost",
        cost: "₹0",
        note: "Open-source MIT / Apache 2.0 gradient boosting libraries",
      },
      {
        item: "PyArrow & Pandas",
        cost: "₹0",
        note: "Open-source columnar data processing tools",
      },
      {
        item: "Local Workstation RAM",
        cost: "₹0",
        note: "Chunked batch processing runs within standard 16GB RAM",
      },
      {
        item: "Scikit-Learn Evaluation Suite",
        cost: "₹0",
        note: "Open-source metric & validation framework",
      },
    ],

    makeItYours: [
      "E-Commerce Promo Abuse & Reseller Ring Detector: Identifies automated multi-account voucher farming using IP clustering and card finger-printing.",
      "Insurance Fraud Claims Ring Investigator: Connects body shop repair estimates, claimant relationships, and policy age features to detect staged accident claims.",
      "Cryptocurrency Bridge Wash-Trading Detector: Identifies circular transaction hops across liquidity pools designed to artificially inflate trading volume.",
    ],
  },
  {
    slug: "fitbuddy-voice-workout-assistant",
    title: "FitBuddy — Voice-Controlled Workout Assistant",
    oneLine:
      "A hands-free voice-driven workout companion built in Streamlit that generates dynamic exercise routines, manages synchronized set countdowns, and speaks audio cues via pyttsx3.",
    shipped: "2026-08-30",
    updated: "2026-08-30",
    minutes: 60,
    tools: ["Streamlit", "SpeechRecognition", "pyttsx3", "Altair", "Python"],
    codeWritten: true,
    liveUrl: "https://fitbuddy.algobic.in",
    builder: "LogixLoops",
    cost: 0,
    difficulty: "first-build",

    whatItDoes:
      "Say a muscle group ('chest', 'legs', 'back') or a trigger command ('okay start'), and FitBuddy generates a targeted routine (3 randomized exercises per muscle group), then guides you through 30-second set timers with audio countdowns and spoken feedback via local text-to-speech — keeping your hands free and eyes off the screen mid-set. Workout logs track duration, calories burned, and frequency, rendered on an interactive Altair dashboard.",

    whyItMatters:
      "Touching a phone screen with sweaty hands mid-set breaks training cadence and momentum. Voice interaction is the natural ergonomic modality for physical training. FitBuddy demonstrates how to implement a complete bi-directional voice loop (Speech-to-Text input → Intent state machine → Text-to-Speech audio cues) inside Streamlit, turning a lightweight Python framework into an interactive workout companion.",

    highlights: [
      "Full hands-free audio loop: Google Speech Recognition paired with offline pyttsx3 text-to-speech cues",
      "Synchronized set timers with voice alerts at halfway mark (15s) and final 5-second countdown",
      "Dynamic workout generator sampling 3 non-repetitive exercises per muscle group with rest intervals",
      "Interactive session analytics dashboard powered by Altair charts measuring workout intensity and volume",
      "Transparent state framing: clearly documents in-memory Streamlit session state architecture with SQLite upgrade path",
    ],

    useCases: [
      "Home gym training and bodyweight HIIT workouts where hands are occupied on floor or equipment",
      "Accessibility-focused fitness companion for visually impaired trainees",
      "Compact reference pattern for embedding bi-directional voice interaction into Streamlit apps",
      "Interval timing and voice-guided stretch routines for desk workers",
    ],

    architecture: [
      {
        step: "01 / Listen",
        tool: "SpeechRecognition",
        role: "Captures microphone audio and transcribes spoken commands via Google Speech API",
      },
      {
        step: "02 / Routine",
        tool: "Exercise Matrix",
        role: "Generates randomized 3-exercise sets mapped to target muscle groups with rest intervals",
      },
      {
        step: "03 / Timer",
        tool: "Python Async Timer",
        role: "Drives 30-second interval state machines with real-time Streamlit progress bars",
      },
      {
        step: "04 / Audio Cue",
        tool: "pyttsx3 TTS Engine",
        role: "Speaks countdown triggers, exercise transitions, and motivational encouragement",
      },
      {
        step: "05 / Telemetry",
        tool: "Altair & Streamlit",
        role: "Renders session duration, exercise breakdown, and estimated energy expenditure",
      },
    ],

    thePath: [
      {
        step: 1,
        title: "Configuring Speech Recognition & Microphone Stream",
        detail:
          "Initialize SpeechRecognition with ambient noise calibration and timeout thresholds to capture short voice commands cleanly.",
        prompt:
          "recognizer = sr.Recognizer()\nwith sr.Microphone() as source:\n    recognizer.adjust_for_ambient_noise(source, duration=0.8)\n    audio = recognizer.listen(source, timeout=5, phrase_time_limit=4)\ncommand = recognizer.recognize_google(audio).lower()",
      },
      {
        step: 2,
        title: "Building Offline pyttsx3 Speech Synthesizer",
        detail:
          "Configure the offline text-to-speech engine with custom voice rate (160 wpm) and pitch properties for crisp gym audio cues.",
        prompt:
          "engine = pyttsx3.init()\nengine.setProperty('rate', 165)\ndef speak(text: str):\n    engine.say(text)\n    engine.runAndWait()",
      },
      {
        step: 3,
        title: "Synchronized Interval Timer & Streamlit Progress Loop",
        detail:
          "Create a non-blocking countdown loop updating Streamlit UI progress bars while speaking milestone announcements at 15s and 5s marks.",
        prompt:
          "for remaining in range(duration, 0, -1):\n    progress_bar.progress((duration - remaining) / duration)\n    time_placeholder.markdown(f'## {remaining}s')\n    if remaining == 15: speak('Halfway there! Keep pushing!')\n    elif remaining <= 3: speak(str(remaining))\n    time.sleep(1)",
      },
      {
        step: 4,
        title: "Altair Session History Visualizer",
        detail:
          "Track completed exercises and set durations in Streamlit session_state, plotting cumulative volume and muscle group distribution in Altair.",
        prompt:
          "chart = alt.Chart(df_history).mark_bar().encode(\n    x=alt.X('exercise:N', title='Exercise'),\n    y=alt.Y('duration_sec:Q', title='Time Under Tension (s)'),\n    color='muscle_group:N'\n).properties(height=280)",
      },
    ],

    whereItBroke: {
      tell: "Microphone listener hung indefinitely in noisy environments, freezing the entire Streamlit UI thread.",
      breakdown:
        "Default SpeechRecognition.listen() blocks until silence is detected. Background music or heavy breathing prevented silence thresholds from triggering, locking the main execution thread.",
      solution:
        "Added strict phrase_time_limit=4.0 and timeout=3.0 parameters to SpeechRecognition.listen(), paired with automatic ambient noise calibration on each turn, ensuring the listener never hangs.",
    },

    costBreakdown: [
      {
        item: "Streamlit Framework",
        cost: "₹0",
        note: "Open-source Apache 2.0 web framework",
      },
      {
        item: "Google Speech API (SpeechRecognition)",
        cost: "₹0",
        note: "Free default endpoint for SpeechRecognition library",
      },
      {
        item: "pyttsx3 Engine",
        cost: "₹0",
        note: "100% offline local system text-to-speech with zero cloud dependencies",
      },
      {
        item: "Altair Visualization",
        cost: "₹0",
        note: "Open-source declarative statistical visualization library",
      },
      {
        item: "Local Python Runtime",
        cost: "₹0",
        note: "Runs locally on standard CPU hardware",
      },
    ],

    makeItYours: [
      "Tabata & HIIT Voice Interval Coach: Runs high-intensity 20s work / 10s rest cycles with custom audio beeps and interval stats.",
      "Yoga & Pranayama Breath Pacer: Speaks calming inhalation/exhalation pacing cues with gentle background chimes.",
      "Physiotherapy Rep Counter & Form Reminder: Guides rehabilitation patients through slow eccentric holds with verbal form cues.",
    ],
  },
  {
    slug: "linux-command-system-ssh-controller",
    title: "Linux Command System via SSH — Remote OS Control from the Terminal",
    oneLine:
      "An interactive Python CLI tool for administering remote Linux hosts over SSH, executing file operations, user management, and package installation from a single terminal.",
    shipped: "2026-08-30",
    updated: "2026-08-30",
    minutes: 45,
    tools: ["Python", "SSH", "Paramiko", "Linux Shell", "Bash"],
    codeWritten: true,
    liveUrl: "https://linux-ssh.algobic.in",
    builder: "LogixLoops",
    cost: 0,
    difficulty: "first-build",

    whatItDoes:
      "Authenticate into remote Linux instances via SSH credentials or key-pairs, then execute administrative tasks (file CRUD, directory navigation, user creation/deletion, yum/apt package installs, and permission modifications) through an interactive CLI menu that translates requests into remote shell executions without leaving the local terminal session.",

    whyItMatters:
      "Understanding how to programmatically drive remote operating systems over SSH is foundational to all DevOps and infrastructure automation. This build serves as the direct first-principles baseline for remote systems administration — establishing how SSH channels, stdin/stdout streams, and exit codes operate before progressing to higher-level autonomous agents (such as SYNAPSE) that layer in AST safety gates and verification loops.",

    highlights: [
      "Interactive CLI menu interface mapping administrative requests to parameterized remote Bash commands",
      "Multi-operation module: File CRUD (cat, touch, rm, chmod), User Management (useradd, userdel), and Package Management (yum install)",
      "Real-time stdout/stderr stream handling with formatted exit status code reporting",
      "Direct comparison baseline against autonomous agent architectures like SYNAPSE",
      "Honest security framing: explicitly highlights command injection mitigation via shlex parameterization and key-based auth upgrade paths",
    ],

    useCases: [
      "Hands-on educational baseline for learning programmatic SSH control and remote server administration",
      "Rapid homelab and local test VM management without opening separate terminal windows",
      "Scripted sandbox for testing automated Linux user provisioning and package deployment routines",
      "Foundation layer for building custom server health monitors and remote log analyzers",
    ],

    architecture: [
      {
        step: "01 / Connect",
        tool: "SSH Transport Channel",
        role: "Establishes encrypted SSH session to target IP with username and key/password credentials",
      },
      {
        step: "02 / Menu Interface",
        tool: "Python CLI REPL",
        role: "Presents interactive numerical and command action trees for system administration",
      },
      {
        step: "03 / Validation",
        tool: "shlex & Input Sanitizer",
        role: "Validates arguments and escapes shell metacharacters to prevent command injection",
      },
      {
        step: "04 / Execution",
        tool: "Remote Bash Subshell",
        role: "Executes target command on remote Linux host and captures return code ($?)",
      },
      {
        step: "05 / Stream",
        tool: "stdout / stderr Reader",
        role: "Pipes remote output streams back to local terminal with ANSI status formatting",
      },
    ],

    thePath: [
      {
        step: 1,
        title: "Establishing the Paramiko SSH Client Session",
        detail:
          "Set up the SSH client session with AutoAddPolicy for known hosts and connection timeout handlers.",
        prompt:
          "ssh = paramiko.SSHClient()\nssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())\nssh.connect(hostname=ip, username=user, password=pwd, timeout=5)\nprint(f'Connected to remote host: {ip}')",
      },
      {
        step: 2,
        title: "Building Parameterized Command Dispatchers",
        detail:
          "Write modular functions for file management, package installations, and user administration using shlex.quote to prevent shell injection.",
        prompt:
          "def remote_exec(cmd: str):\n    stdin, stdout, stderr = ssh.exec_command(cmd)\n    exit_status = stdout.channel.recv_exit_status()\n    return {'out': stdout.read().decode(), 'err': stderr.read().decode(), 'code': exit_status}",
      },
      {
        step: 3,
        title: "Interactive CLI Menu & Multi-Action Router",
        detail:
          "Create the user selection loop offering clean options for disk usage (df -h), service status, user creation (useradd), and package updates.",
        prompt:
          "while True:\n    print('1. List Files  2. Check Disk  3. Install Package  4. Manage Users  5. Exit')\n    choice = input('Select: ').strip()\n    if choice == '1': remote_exec('ls -la')\n    elif choice == '2': remote_exec('df -h')\n    elif choice == '5': break",
      },
      {
        step: 4,
        title: "Output Streaming & Exit Status Formatting",
        detail:
          "Format remote stdout with green output blocks and highlight stderr errors with red badges for immediate operator feedback.",
        prompt:
          "res = remote_exec(cmd)\nif res['code'] == 0:\n    print(f'[SUCCESS]\\n{res[\"out\"]}')\nelse:\n    print(f'[ERROR code={res[\"code\"]}]\\n{res[\"err\"]}')",
      },
    ],

    whereItBroke: {
      tell: "Typing filenames with spaces (e.g., 'my report.txt') or punctuation caused remote shell commands to split and fail or delete unintended files.",
      breakdown:
        "Raw string interpolation (f'rm {filename}') allowed unquoted spaces and special characters to be interpreted as separate command arguments by the remote Bash subshell.",
      solution:
        "Wrapped all user-provided paths and arguments in shlex.quote() before building the SSH execution payload, preventing argument splitting and shell injection vulnerabilities.",
    },

    costBreakdown: [
      {
        item: "Python Standard Library & Paramiko",
        cost: "₹0",
        note: "Open-source LGPL SSH client library for Python",
      },
      {
        item: "Local Linux Test VM / Docker",
        cost: "₹0",
        note: "Runs against local Alpine/Ubuntu container or homelab node",
      },
      {
        item: "Standard OpenSSH Server",
        cost: "₹0",
        note: "Open-source BSD OpenSSH daemon on target Linux machine",
      },
      {
        item: "Local Terminal Client",
        cost: "₹0",
        note: "Zero-cost native terminal on local workstation",
      },
    ],

    makeItYours: [
      "Multi-Server Ping & Disk Usage Aggregator: Concurrently checks disk utilization across 10+ remote nodes and outputs an alert summary table.",
      "Automated Nginx SSL Cert Renewal CLI: Connects to remote web servers, triggers Certbot renewals, and restarts Nginx services.",
      "Docker Container Status & Log Inspector: Remotely queries docker ps, streams container logs, and restarts failed pods over SSH.",
    ],
  },
  {
    slug: "fitladder-fitness-recomposition-tracker",
    title: "Fitladder — Fitness, Workout & Body Recomposition Tracker",
    oneLine:
      "An offline-first Flutter mobile application for tracking 6-day workout splits, budget-aware macro planning, and body recomposition metrics with Riverpod state architecture.",
    shipped: "2026-08-30",
    updated: "2026-08-30",
    minutes: 180,
    tools: ["Flutter 3.x", "Dart", "Riverpod", "SharedPreferences", "CustomPainter"],
    codeWritten: true,
    liveUrl: "https://fitladder.algobic.in",
    builder: "LogixLoops",
    cost: 0,
    difficulty: "second",

    whatItDoes:
      "Provides a structured 6-day workout split (Push, Pull, Legs, Hypertrophy, Conditioning) with animated exercise demonstrations, per-set weight/rep logging, and rest interval timers. A budget-aware nutrition module calculates remaining daily macronutrient targets and deterministically matches foods from a verified Indian & international dietary database (whey, paneer, eggs, chicken, oats, rice, lentils) to suggest balanced meal combos that fit remaining caloric allocations. The app also features a body recomposition dashboard tracking body fat percentage vs. target weight on dynamic CustomPainter gauges, along with digital QR gym check-in passes.",

    whyItMatters:
      "Gyms and basement fitness centers are notoriously prone to zero cellular reception. Fitness apps that rely on continuous cloud API requests fail at the exact moment a trainee needs to log a set or check an exercise cue. Fitladder embraces a 100% local-first mobile architecture using Flutter and Riverpod: entire workout logs, meal databases, and user profiles serialize to local SharedPreferences and SQLite, ensuring zero latency, zero subscription costs, and seamless offline functionality, with cloud sync cleanly decoupled as a planned roadmap phase.",

    highlights: [
      "100% Offline-First architecture: Riverpod reactive state management + JSON-serialized local persistence",
      "Structured 6-day workout program featuring animated exercise cards and per-set progressive overload logging",
      "Budget-aware macro matcher: deterministically computes meal combinations that fit exact remaining calorie/protein targets",
      "Dynamic body recomposition gauge built with custom Flutter Canvas & CustomPainter primitives",
      "Modular feature-first folder architecture (dashboard/, nutrition/, workout/, profile/) designed for scalable on-device LLM additions",
    ],

    useCases: [
      "Basement gym trainees logging sets without network interruptions",
      "High-protein Indian dietary planning (vegetarian, eggetarian, non-vegetarian meal budgeting)",
      "Personal trainers managing offline client workout cards and recomposition targets",
      "Reference implementation for architecting clean, offline-first mobile apps in Flutter",
    ],

    architecture: [
      {
        step: "01 / State Core",
        tool: "Riverpod 2.x",
        role: "Reactive dependency injection and immutable state providers across workout and diet domains",
      },
      {
        step: "02 / Workout Split",
        tool: "Exercise Engine",
        role: "Manages 6-day PPL/Hypertrophy cycle, animated SVG assets, and set/rep logging tables",
      },
      {
        step: "03 / Nutrition",
        tool: "Macro Solver",
        role: "Deterministic solver matching remaining protein/carb/fat budget against food library",
      },
      {
        step: "04 / Persistence",
        tool: "SharedPreferences & JSON",
        role: "Client-side local disk serialization guaranteeing instant offline reads and writes",
      },
      {
        step: "05 / Canvas UI",
        tool: "Flutter CustomPainter",
        role: "Renders circular body-fat recomposition gauges, progress arcs, and QR membership passes",
      },
    ],

    thePath: [
      {
        step: 1,
        title: "Architecting Riverpod State Providers for Offline Persistence",
        detail:
          "Define StateNotifier providers for user profile, daily logs, and nutrition, saving updates automatically to local JSON storage.",
        prompt:
          "class WorkoutNotifier extends StateNotifier<WorkoutState> {\n  WorkoutNotifier(this.prefs) : super(WorkoutState.initial()) { loadFromStorage(); }\n  final SharedPreferences prefs;\n  void logSet(String exerciseId, int reps, double weight) {\n    state = state.addSet(exerciseId, reps, weight);\n    prefs.setString('workout_history', jsonEncode(state.toJson()));\n  }\n}",
      },
      {
        step: 2,
        title: "Building the 6-Day Structured Workout Split UI",
        detail:
          "Construct modular exercise cards with animated GIF/Lottie demonstrations, warm-up calculators, and rest timers.",
        prompt:
          "Widget buildExerciseCard(Exercise ex) {\n  return Card(\n    child: Column(\n      children: [\n        Image.asset(ex.animAsset, height: 180),\n        Text(ex.name, style: Theme.of(context).textTheme.titleMedium),\n        SetLoggingTable(exerciseId: ex.id)\n      ]\n    )\n  );\n}",
      },
      {
        step: 3,
        title: "Implementing the Deterministic Macro Budget Solver",
        detail:
          "Write a constraint-matching algorithm that queries the local food catalog to suggest meals satisfying remaining calorie and protein requirements.",
        prompt:
          "List<FoodItem> suggestMeals(MacroBudget remaining) {\n  return foodCatalog.where((food) =>\n    food.calories <= remaining.calories &&\n    food.protein >= remaining.protein * 0.4\n  ).toList();\n}",
      },
      {
        step: 4,
        title: "Drawing the Body Recomposition Canvas Gauge",
        detail:
          "Create a CustomPainter that paints radial gradient arcs visualizing current body fat percentage against target recomposition goals.",
        prompt:
          "class RecompGaugePainter extends CustomPainter {\n  @override\n  void paint(Canvas canvas, Size size) {\n    final paint = Paint()..style = PaintingStyle.stroke..strokeWidth = 14;\n    canvas.drawArc(Rect.fromLTWH(0, 0, size.width, size.height), -pi, pi * progress, false, paint);\n  }\n}",
      },
    ],

    whereItBroke: {
      tell: "App state reset to default values whenever the user closed the app during an active workout session.",
      breakdown:
        "Set logs were held only in transient Riverpod memory variables without immediate disk persistence, causing app kill events to wipe out active session progress.",
      solution:
        "Implemented auto-saving transactional middleware in Riverpod that flushes workout state to SharedPreferences on every single set recorded, recovering incomplete sessions seamlessly on relaunch.",
    },

    costBreakdown: [
      {
        item: "Flutter SDK 3.x & Dart",
        cost: "₹0",
        note: "Open-source BSD-3-Clause mobile application framework",
      },
      {
        item: "Riverpod & SharedPreferences",
        cost: "₹0",
        note: "Open-source state management and local mobile storage",
      },
      {
        item: "Local Dietary & Exercise Data",
        cost: "₹0",
        note: "Bundled local JSON assets with zero cloud API dependencies",
      },
      {
        item: "Vector Assets & Canvas UI",
        cost: "₹0",
        note: "Open-source icons and native Flutter CustomPainter rendering",
      },
    ],

    makeItYours: [
      "Powerlifting 5/3/1 Percentage Calculator: Computes training max percentages and generates warm-up set progressions.",
      "Keto & Low-Carb Macro Tracker: Tailors the budget solver to strictly constrain net carbohydrates under 25g daily.",
      "Climbing & Hangboard Interval Coach: Manages 7s hang / 3s rest grip protocols with audio cues and grip difficulty logs.",
    ],
  },
  {
    slug: "reporadar-github-health-analyzer",
    title: "RepoRadar — AI-Powered GitHub Repository Health Analyzer",
    oneLine:
      "A real-time repository health auditor running parallel 6-dimension static analysis (Radon, Bandit, CI/CD, Tests) with live SSE event streaming and a 4-tier LLM fallback chain.",
    shipped: "2026-08-30",
    updated: "2026-08-30",
    minutes: 210,
    tools: ["FastAPI", "Radon", "Bandit", "Groq / Gemini", "Server-Sent Events", "React 19"],
    codeWritten: true,
    liveUrl: "https://reporadar.algobic.in",
    builder: "LogixLoops",
    cost: 0,
    difficulty: "second",

    whatItDoes:
      "Paste any public GitHub repository URL to receive an interactive 6-dimensional health score across Code Quality (Radon cyclomatic complexity & maintainability index), Documentation, Dependencies, Test Coverage, CI/CD configuration, and Security (Bandit static AST scanning for secrets & unsafe calls). Six async analyzers execute concurrently via asyncio.gather against a shallow git clone (--depth 1), streaming real-time completion events over Server-Sent Events (SSE) that animate the radar chart spoke-by-spoke. A 4-tier fallback synthesis chain (Groq → Gemini → Local Ollama → Deterministic Jinja2 template) generates a prioritized fix list validated against strict Pydantic JSON schemas with embeddable SVG badges and OG preview cards.",

    whyItMatters:
      "Evaluating open-source dependencies or vetting candidate portfolios usually requires manual inspection across multiple files and config folders. RepoRadar delivers true reliability engineering: parallel analysis driven by actual tool execution (not fake progress timers), strict schema validation that automatically rejects and falls through malformed LLM outputs, and a final zero-API-key deterministic fallback template ensuring the tool remains 100% operational even during total upstream AI outages.",

    highlights: [
      "Parallel 6-dimension async analyzer using asyncio.gather across shallow git clones (--depth 1)",
      "Real-time Server-Sent Events (SSE) protocol streaming dimension scores to animate radar chart spokes live",
      "4-Tier resilient LLM synthesis chain: Groq Llama 3.3 → Gemini 2.5 Flash → Local Ollama → Deterministic template",
      "Strict Pydantic JSON schema validation rejecting malformed LLM outputs with instant fallback",
      "Static analysis foundation powered by industry-standard tools (Radon AST complexity + Bandit security scanner)",
    ],

    useCases: [
      "Open-source due diligence before adding third-party npm/pip packages to production codebases",
      "Engineering manager & maintainer repository hygiene audits and continuous repo grading",
      "Candidate portfolio code review and technical depth assessment for hiring teams",
      "Embeddable SVG health badge generation for open-source project READMEs",
    ],

    architecture: [
      {
        step: "01 / Clone & Ingest",
        tool: "Git Shallow Clone",
        role: "Executes git clone --depth 1 to fetch target repository in < 2 seconds into isolated temp directory",
      },
      {
        step: "02 / Parallel Analyzers",
        tool: "asyncio.gather & Radon / Bandit",
        role: "Runs 6 concurrent analysis modules (complexity, security, docstrings, tests, workflows, deps)",
      },
      {
        step: "03 / Live Stream",
        tool: "Server-Sent Events (SSE)",
        role: "Pushes per-dimension score payloads as they finish to render dynamic radar chart spokes",
      },
      {
        step: "04 / Synthesis Chain",
        tool: "4-Tier Fallback Router",
        role: "Routes aggregate metrics through Groq -> Gemini -> Ollama -> Deterministic Jinja template",
      },
      {
        step: "05 / Delivery",
        tool: "FastAPI & SVG Generator",
        role: "Emits dynamic embeddable README SVG badges and social OG preview image cards",
      },
    ],

    thePath: [
      {
        step: 1,
        title: "Configuring Parallel Asyncio Analyzers with Radon & Bandit",
        detail:
          "Write non-blocking analyzer wrappers that inspect Python ASTs for cyclomatic complexity and security vulnerabilities.",
        prompt:
          "async def analyze_repo(repo_path: str, send_sse: Callable):\n    tasks = [\n        run_radon_complexity(repo_path, send_sse),\n        run_bandit_security(repo_path, send_sse),\n        check_documentation(repo_path, send_sse),\n        check_test_coverage(repo_path, send_sse),\n        check_cicd_pipelines(repo_path, send_sse),\n        check_dependencies(repo_path, send_sse)\n    ]\n    return await asyncio.gather(*tasks)",
      },
      {
        step: 2,
        title: "Streaming Real-Time Dimension Events via SSE in FastAPI",
        detail:
          "Create an SSE streaming endpoint that dispatches individual analyzer outcomes to the frontend as soon as each thread resolves.",
        prompt:
          "@app.get('/api/analyze/stream')\nasync def stream_analysis(url: str):\n    async def event_generator():\n        async for event in run_pipeline(url):\n            yield f'data: {json.dumps(event)}\\n\\n'\n    return StreamingResponse(event_generator(), media_type='text/event-stream')",
      },
      {
        step: 3,
        title: "Building the 4-Tier Resilient LLM Fallback Chain",
        detail:
          "Implement a cascade of LLM providers with Pydantic JSON validation that falls through to deterministic templates if outputs are invalid.",
        prompt:
          "async def synthesize_report(metrics: RepoMetrics) -> HealthReport:\n    for provider in [call_groq, call_gemini, call_ollama]:\n        try:\n            raw = await provider(metrics)\n            return HealthReport.model_validate_json(raw)\n        except (ValidationError, Exception):\n            continue\n    return generate_deterministic_template(metrics) # ₹0, 0 API keys required",
      },
      {
        step: 4,
        title: "Generating Dynamic Embeddable SVG Badges",
        detail:
          "Create an endpoint that constructs dynamic SVG badges color-coded by grade (A: green, B: blue, C: yellow, F: red) for GitHub READMEs.",
        prompt:
          "@app.get('/badge/{repo_id}.svg')\ndef render_badge(repo_id: str):\n    score = get_cached_score(repo_id)\n    color = '#10b981' if score >= 80 else '#f59e0b' if score >= 60 else '#ef4444'\n    return Response(content=f'<svg>...<text>{score}/100</text></svg>', media_type='image/svg+xml')",
      },
    ],

    whereItBroke: {
      tell: "LLM outputs frequently contained markdown wrappers (like ```json ... ```) that broke standard JSON.parse() and crashed client rendering.",
      breakdown:
        "Even with strict prompt instructions, upstream LLM providers occasionally wrapped output in markdown code blocks or appended trailing commentary, causing JSON parse errors.",
      solution:
        "Added a regex JSON extraction filter (re.search(r'\\{.*\\}', output, re.DOTALL)) paired with strict Pydantic model validation. If parsing still fails, the engine automatically catches the error and falls through to the next provider in the cascade.",
    },

    costBreakdown: [
      {
        item: "FastAPI & Python",
        cost: "₹0",
        note: "Open-source asynchronous backend runtime",
      },
      {
        item: "Radon & Bandit",
        cost: "₹0",
        note: "Open-source static analysis and security AST toolsets",
      },
      {
        item: "Groq Cloud & Google Gemini",
        cost: "₹0",
        note: "Free tier API tiers (Groq 30 RPM, Gemini 15 RPM)",
      },
      {
        item: "Ollama Local Engine",
        cost: "₹0",
        note: "Runs local quantized Llama 3 model on local machine",
      },
      {
        item: "React 19 & Tailwind CSS v4",
        cost: "₹0",
        note: "Open-source frontend hosted on Vercel / GitHub Pages",
      },
    ],

    makeItYours: [
      "Docker Image Security & Layer Optimizer: Clones Dockerfiles, runs Hadolint static analysis, and computes image layer size optimizations.",
      "Smart Contract Solidity Auditor: Analyzes Ethereum smart contracts with Slither and Mythril to flag reentrancy vulnerabilities.",
      "Frontend Bundle Size & Web Vitals Predictor: Analyzes package.json and webpack/vite configs to forecast bundle bloat before deployment.",
    ],
  },
] as const;

/** "3h 20m", "45m". */
export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

/** "₹0": no decimals, because every build page is free by admission rule. */
export function formatCost(inr: number): string {
  return `₹${inr.toLocaleString("en-IN")}`;
}

/** Newest first. */
export function latestBuilds(count: number): readonly Build[] {
  return [...BUILDS]
    .sort((a, b) => b.shipped.localeCompare(a.shipped))
    .slice(0, count);
}

export function getBuild(slug: string): Build | undefined {
  return BUILDS.find((b) => b.slug === slug);
}
