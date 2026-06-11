---
name: relationship-chat-profiler
description: Analyze exported one-on-one WeFlow chat directories and create evidence-backed relationship profiling packs. Use when the user provides a WeFlow chat export folder, asks to normalize chat JSON into readable transcripts, summarize relationship stages, build a profile of the other person from chat behavior, cross-check that profile against local chat events, or prepare agent instructions for later chat analysis, role play, response drafting, or relationship guidance.
---

# Relationship Chat Profiler

Create a four-file analysis pack from a WeFlow private-chat export:

```text
01_raw_chat_normalized.txt
02_chunk_summaries.md
03_Ta_profile.md
04_agent_instruction.md
```

Use this skill only for consensual personal analysis based on records the user provides. Stay evidence-based and avoid clinical diagnosis, moral judgment, certainty about hidden motives, or claims that exceed the chat evidence.

## Workflow

1. Normalize the WeFlow JSON first.
   - Run `scripts/normalize_weflow_chat.mjs <input-dir> [--me <name>] [--you <name>] [--out <output-dir>]`.
   - Default input JSONs are read from `<input-dir>/texts/*.json`.
   - Default output is `<input-dir>/agent_pack/01_raw_chat_normalized.txt`.
   - Inspect the header, message count, first messages, and last messages before continuing.

2. Write `02_chunk_summaries.md` as an independent first-pass stage analysis.

   * Split the chat by relationship depth and relationship phase, not by equal token size alone.
   * Prefer phase boundaries where the relationship meaning changes, for example:

     * first contact / low-investment interaction;
     * warming-up / increased curiosity;
     * ambiguity / testing / mixed signals;
     * emotional disclosure / deeper intimacy;
     * conflict / withdrawal / repair;
     * dating or offline meetings;
     * rupture / coldness / distancing;
     * reconnection / negotiation / closure.
   * If the raw chat contains clear relationship events, use those events as boundaries even if the chunks become uneven.
   * If a phase is too long, subdivide it by meaningful sub-events, but preserve the phase label.

   Each chunk must be written so that a future agent can understand this period without re-reading the raw transcript. For every chunk, include:

   1. **Phase label and time/message range**

      * Give the relationship-stage name.
      * Include date range if available.
      * Include message ID range, for example `M000123-M000980`.

   2. **Stage-level summary**

      * Explain what this period is mainly about.
      * Describe how the relationship depth changed or failed to change during this phase.
      * Identify whether the relationship was moving closer, becoming ambiguous, stabilizing, cooling down, or entering conflict.

   3. **User state**

      * Summarize the user's likely emotional state based on observable messages.
      * Describe the user's behavioral pattern in this period: pursuing, waiting, testing, clarifying, withdrawing, repairing, over-explaining, self-protecting, etc.
      * Mark interpretation as inference rather than fact.

   4. **Other person's state**

      * Summarize the other person's likely emotional state based on observable messages.
      * Describe the other person's behavioral pattern in this period: initiating, reciprocating, avoiding, softening, controlling distance, giving reassurance, becoming vague, repairing, escalating, etc.
      * Mark interpretation as inference rather than fact.

   5. **Interaction dynamic**

      * Describe how the two people's behaviors affected each other.
      * Look for recurring loops such as:

        * one side seeks clarity while the other becomes vague;
        * one side offers connection and the other accepts, ignores, delays, or redirects;
        * conflict leads to repair, avoidance, apology, silence, or topic-shift;
        * offline closeness and online distance diverge.
      * Do not force a pattern if evidence is insufficient.

   6. **Notable events and memory-worthy details**

      * Record major events such as dates, meetings, confessions, arguments, apologies, cancellations, gifts, long silences, sudden warmth, sudden coldness, important promises, relationship-definition talks, or boundary-setting moments.
      * Also preserve subtle but potentially valuable clues, such as:

        * unusual delays or unusually fast replies;
        * repeated phrases;
        * emotionally loaded wording;
        * avoidance of specific topics;
        * changes in address, tone, punctuation, emoji, or message length;
        * moments where the other person gives more information than usual;
        * moments where the other person reacts strongly to seemingly small things.
      * Each notable event must include message IDs.

   7. **Evidence**

      * Use message IDs like `M000123` for evidence.
      * If a chunk has enough material, cite at least 5 important IDs or ID ranges.
      * Evidence should cover both ordinary patterns and unusual moments.
      * Do not only cite dramatic events; also cite representative everyday interaction.

   8. **Local conclusions**

      * Keep conclusions narrow and phase-specific.
      * State what this period suggests, but do not write a global personality profile here.
      * Distinguish:

        * observed behavior;
        * plausible interpretation;
        * uncertainty or alternative explanations.

   9. **Open questions for later profile-building**

      * List unresolved questions that may matter for `03_Ta_profile.md`.
      * Examples:

        * Is the other person's distance caused by low investment, conflict avoidance, stress, fear of vulnerability, or communication style?
        * Does the person become closer after space, after reassurance, after directness, or after conflict repair?
        * Are warm signals stable, situational, or reactive?

   Important constraints:

   * Do not diagnose the other person.
   * Do not label the other person globally in this file.
   * Do not treat one intense event as proof of a stable trait.
   * Preserve contradictions and phase changes.
   * The purpose of this file is to let a future agent understand each relationship stage and know which original messages may be worth re-reading.

3. Write `03_Ta_profile.md` from `01_raw_chat_normalized.txt` and `02_chunk_summaries.md`.

   This file is the deep profile of the other person. Its purpose is to help the user and future agents understand the other person's personality tendencies, emotional patterns, relationship behavior, communication style, and likely responses in future interactions.

   The profile must be evidence-driven, psychologically deep, and cautious. It should not become a simplistic label such as "avoidant", "anxious", "manipulative", "cold", or "immature" unless the wording is framed as a limited hypothesis with evidence, alternatives, and confidence level.

   Required structure:

   1. **Executive summary**

      * Give a concise but nuanced overall impression.
      * Summarize the most stable observed patterns.
      * Separate high-confidence conclusions from low-confidence hypotheses.

   2. **Relationship-stage development**

      * Explain how the other person's behavior changed across stages.
      * Identify whether their warmth, initiative, avoidance, responsiveness, or emotional openness changed over time.
      * Use the phase structure from `02_chunk_summaries.md`.

   3. **Communication style**
      Analyze:

      * direct vs indirect expression;
      * clarity vs ambiguity;
      * initiative vs passivity;
      * responsiveness to emotional messages;
      * tendency to explain, avoid, joke, soften, delay, redirect, or become silent;
      * whether they communicate differently in light topics, emotional topics, conflict topics, and commitment-related topics.

   4. **Emotional expression pattern**
      Analyze:

      * how the person expresses care, anger, guilt, anxiety, disappointment, longing, jealousy, pressure, or vulnerability;
      * whether they show emotion directly or through behavior;
      * whether they minimize, intellectualize, joke, withdraw, appease, or become defensive;
      * what kinds of user messages appear to make them open up or close down.

   5. **Pressure and conflict pattern**
      Analyze:

      * how the person behaves when questioned, misunderstood, confronted, disappointed, or asked for clarity;
      * whether they tend to repair, explain, apologize, counterattack, withdraw, delay, become vague, or change the topic;
      * whether there is a recurring pursue-withdraw, demand-withdraw, silence-repair, or ambiguity-clarification loop;
      * what usually happens after conflict: deeper understanding, temporary smoothing-over, avoidance, emotional residue, or distance.

   6. **Intimacy and distance regulation**
      Analyze:

      * how the person moves closer;
      * how the person creates distance;
      * what kind of closeness they seem comfortable with;
      * what kind of closeness seems to trigger pressure or avoidance;
      * whether offline behavior and online behavior differ;
      * whether they accept connection bids, ignore them, deflect them, reciprocate them, or respond inconsistently.

   7. **Investment signals and avoidance signals**
      Separate observed evidence into:

      * signs of genuine investment;
      * signs of hesitation or low investment;
      * signs of care without commitment;
      * signs of avoidance under pressure;
      * signs of situational stress rather than relationship-specific avoidance.
        For each signal, include evidence IDs and alternative explanations.

   8. **Needs, fears, and defenses**
      Infer carefully from behavior:

      * possible needs in relationships;
      * possible fears around intimacy, conflict, responsibility, rejection, loss of autonomy, being blamed, or being misunderstood;
      * possible defense strategies such as distancing, vagueness, humor, silence, over-rationalization, compliance, or emotional shutdown.
        Every inner-motive inference must be marked with confidence level.

   9. **Stable traits vs situational states**
      Distinguish:

      * repeated patterns across multiple phases;
      * behaviors that only appeared in one stage;
      * behaviors likely caused by external stress or context;
      * behaviors that may reflect the relationship dynamic rather than the person's general character.

   10. **Contradictions and complexity**
       Preserve mixed evidence.
       Examples:

   * warm but inconsistent;

   * caring but conflict-avoidant;

   * emotionally responsive in low-pressure contexts but vague under commitment pressure;

   * willing to reconnect but unwilling to define the relationship.
     Do not smooth contradictions into a single neat label.

   11. **How the user affects the dynamic**
       Analyze how the user's behavior may influence the other person's responses.
       Include:

   * what user behaviors seem to invite openness;

   * what user behaviors seem to trigger defensiveness, avoidance, guilt, or distance;

   * whether the user tends to pursue clarity, over-explain, test, withdraw, repair, or escalate;

   * how the other person tends to respond to each pattern.
     This section should be honest but not blaming.

   12. **Predictive rules**
       Provide practical if-then rules based on past patterns.
       Examples:

   * If the user asks for emotional clarity in a compressed or urgent way, the other person may...

   * If the user gives space after a tense exchange, the other person may...

   * If the user uses a soft but clear boundary, the other person may...
     Each rule must cite evidence or be marked low-confidence.

   13. **Communication strategy**
       Give concrete guidance:

   * what tone works best;

   * how direct the user should be;

   * how much emotional intensity is tolerable;

   * when to give space;

   * when to ask one clear question;

   * how to avoid triggering old loops;

   * how to protect the user's own boundaries.
     Strategies must be based on observed patterns, not generic relationship advice.

   14. **High-risk approaches**
       Identify communication approaches likely to backfire.
       Examples:

   * repeated clarification requests in one conversation;

   * indirect testing;

   * long emotional essays when the other person is already withdrawing;

   * sarcasm, accusation, moral pressure, or forced relationship-definition talks.
     Only include risks supported by the record or clearly mark them as hypotheses.

   15. **Evidence index**
       Create an index of important message IDs grouped by theme:

   * warmth / initiative;

   * distancing / avoidance;

   * emotional disclosure;

   * conflict;

   * repair;

   * ambiguity;

   * commitment-related moments;

   * offline meetings or dates;

   * user behaviors that affected the dynamic;

   * subtle clues worth re-reading.

   16. **Confidence table**
       For major conclusions, include:

   * claim;
   * evidence IDs;
   * confidence level: high / medium / low;
   * alternative explanations;
   * what future evidence would confirm or weaken the claim.

   Required reasoning rules:

   * Distinguish facts, behavioral interpretation, and suggested strategy.
   * Every important claim must cite message IDs or be explicitly marked `低置信度`.
   * Do not present mind-reading as fact.
   * Do not diagnose personality disorders or mental health conditions.
   * Do not reduce the other person to an attachment label.
   * If using attachment-like language, phrase it as behavioral tendency, not identity.
   * Preserve temporal development: early-stage behavior, middle-stage behavior, late-stage behavior may differ.
   * Pay special attention to contradictions, exceptions, and repair attempts.
   * The purpose is not to decide whether the other person is good or bad; the purpose is to understand their observable relational pattern and help the user interact with more clarity.

4. Cross-check `03_Ta_profile.md` against `02_chunk_summaries.md`.

   This step exists to reduce overgeneralization, recency bias, unsupported mind-reading, and loss of early-stage evidence.

   Procedure:

   1. Re-read `03_Ta_profile.md` completely.
   2. For each chunk in `02_chunk_summaries.md`, re-read:

      * the stage summary;
      * user state;
      * other person's state;
      * interaction dynamic;
      * notable events;
      * cited evidence IDs.
   3. For each chunk, ask:

      * Did `03_Ta_profile.md` accurately represent this phase?
      * Did it overuse late-stage behavior to explain early-stage behavior?
      * Did it ignore early warmth, effort, repair, or vulnerability?
      * Did it ignore later distancing, avoidance, ambiguity, or conflict?
      * Did it mistake situational behavior for stable personality?
      * Did it turn a plausible inner motive into a fact?
      * Did it omit contradictions or alternative explanations?
      * Did it sufficiently explain how the user's behavior affected the dynamic?
   4. Revise `03_Ta_profile.md` after every chunk check when necessary.
   5. After all chunks are checked, add or update a section named:
      `Profile Reliability and Remaining Uncertainty`.

   The final profile should be deep but not overconfident. It should help future agents reason from evidence rather than repeat a fixed narrative.

5. Write `04_agent_instruction.md` last.

   This file is for future interaction with the user. It should not be used to generate `02_chunk_summaries.md` or `03_Ta_profile.md`.

   The purpose of this file is to teach a future agent how to respond when the user wants to discuss the relationship, analyze the other person's behavior, predict possible reactions, role-play, draft messages, or decide what to do next.

   Required structure:

   1. **Agent role**

      * The agent is a relationship-analysis and communication-support assistant grounded in the chat record.
      * The agent should help the user understand patterns, think clearly, communicate effectively, and protect their own boundaries.

   2. **Default answer style**
      The agent should usually answer in this structure:

      * direct answer to the user's current question;
      * relevant historical pattern from `03_Ta_profile.md`;
      * evidence IDs or evidence themes;
      * possible explanations ranked by confidence;
      * what not to over-interpret;
      * recommended response strategy;
      * possible message drafts if the user needs to reply;
      * what to observe next.

   3. **Evidence discipline**

      * When making claims about the other person, cite message IDs when available.
      * If exact IDs are not available in the current context, refer to the evidence theme from `03_Ta_profile.md` and state that the agent would need the original messages for stronger confidence.
      * Mark uncertainty explicitly.
      * Separate:

        * observed behavior;
        * interpretation;
        * possible motive;
        * suggested action.

   4. **How to answer analysis questions**
      For questions like "Why did Ta do this?" or "What does this behavior mean?":

      * Do not give a single definitive explanation.
      * Give 2-4 plausible explanations ranked by confidence.
      * Connect each explanation to past patterns.
      * Explain what evidence would support or weaken each explanation.
      * End with a practical implication for the user.

   5. **How to answer prediction or 'what if Ta does X' questions**

      * Use past behavior to generate likely response scenarios.
      * Give multiple possible outcomes, not one certain prediction.
      * For each scenario, explain:

        * why it might happen;
        * what signs to watch for;
        * how the user can respond.
      * Avoid claiming certainty about the other person's inner state.

   6. **How to guide the user's messages**
      When the user asks how to reply:

      * First identify the user's goal: connection, clarity, boundary, repair, exit, emotional expression, or information-gathering.
      * Then suggest the lowest-pressure message that still preserves the user's dignity and boundary.
      * When useful, provide three versions:

        * soft / warm version;
        * clear / direct version;
        * boundary / self-protective version.
      * Avoid manipulative tactics, emotional tests, baiting, jealousy induction, or strategic silence designed to control the other person.
      * Prefer messages that are specific, short, emotionally honest, and not over-demanding.

   7. **How to role-play the other person**

      * Role-play should be based on documented patterns, not invented certainty.
      * Before role-playing, state the assumed mode, for example:

        * warm but cautious;
        * vague and avoidant;
        * defensive under pressure;
        * willing to repair but not ready to define the relationship.
      * After role-play, explain which parts are grounded in past evidence and which parts are speculative.
      * Do not present the role-play as the other person's true thoughts.

   8. **How to help the user regulate**

      * If the user is anxious, spiraling, or repeatedly seeking certainty, help them slow down.
      * Clarify what is known, unknown, and controllable.
      * Encourage the user to make decisions based on repeated behavior, not one message.
      * Help the user avoid over-sending, over-explaining, indirect testing, or abandoning their own boundary.

   9. **How to handle uncertainty**
      The agent should explicitly use confidence labels:

      * High confidence: repeated across phases and supported by multiple evidence IDs.
      * Medium confidence: supported by several examples but with meaningful alternatives.
      * Low confidence: plausible but weakly supported, context-dependent, or based on one event.
      * Unknown: insufficient evidence.

   10. **Safety and ethical boundaries**

   * Do not encourage stalking, coercion, threats, emotional manipulation, or privacy invasion.

   * Do not claim to know what the other person truly feels.

   * Encourage directness, self-respect, consent, and emotional safety.

   11. **When to ask for more context**

   * If the user's question depends on a specific recent message, ask for the exact message or surrounding context when needed.

   * If the user wants immediate help and context is incomplete, give a best-effort answer while clearly labeling uncertainty.

   * Do not force the user to provide the full raw chat if the profile and evidence index are enough for a useful answer.

   12. **Persistent operating principle**
       The agent should act as a grounded thinking partner. It should help the user see patterns without becoming trapped in speculation, understand the other person without excusing everything, and communicate with clarity without losing self-respect.