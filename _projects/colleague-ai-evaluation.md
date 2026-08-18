---
layout: page
title: Evaluating AI-Generated Lesson Plans
description: Designing a large-scale human evaluation to understand when AI-generated content works for educators and when it doesn't.
img: assets/img/projects/role-overview.svg
importance: 1
category: research
related_publications: false
---

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/role-overview.svg" title="Project overview" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

---

## The Problem

Colleague AI is an NSF-funded platform that generates K-12 math lesson plans using large language models. The platform had built two AI models for this purpose: a fine-tuned LLaMA-2-13B trained on K-12 content, and a customized GPT-4 with domain-specific prompts. But we had no rigorous way to answer a basic question: **would educators actually find these useful compared to plans written by experienced human curriculum designers?**

This was not an abstract research question. The platform was being positioned for real classroom adoption across multiple school districts. Without evidence of where AI-generated content genuinely helped and where it fell short, we risked either overselling the technology or underestimating what it could already do well.

Generic benchmarks and automated metrics could not answer this. Lesson plan quality is deeply contextual. What counts as a strong warm-up activity for 3rd graders is different from what works for 11th graders. Pedagogical quality depends on scaffolding, discourse facilitation, cognitive demand, and real-world connections that no automated metric captures reliably.

We needed human judgment from the people who would actually use this content in classrooms.

---

## Building the Evaluation Framework

Before running any comparison study, I first needed to define what "quality" meant in operational terms. There was no off-the-shelf rubric for evaluating AI-generated lesson plans.

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/codebook-funnel.svg" title="Codebook development process" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Developing the quality codebook: from ~40 candidate criteria identified through literature review and educator interviews, we iteratively refined down to 10 operationally defined metrics through card sorting, affinity diagramming, and structured discussions with educators and education researchers.
</div>

I started with a literature review across learning science and teaching theory, then conducted interviews and focus groups with K-12 math teachers to surface practitioner-grounded criteria that don't appear in academic literature. Things like whether a warm-up actually activates the right prior knowledge, or whether a cool-down gives teachers actionable diagnostic information about what students understood.

This produced roughly 40 candidate criteria. Through iterative collaborative sessions with teachers and education researchers, including card-sorting exercises and affinity diagramming, we consolidated these into **10 well-defined evaluation categories** with precise operational definitions and concrete examples at multiple performance levels.

Each metric had clear scoring anchors so different evaluators would interpret "high quality" consistently. I then designed a structured annotation task where experienced educators labeled lesson plan sections against the codebook, highlighting specific text spans and providing written rationales for their scores. I tracked inter-annotator consistency and resolved disagreements through adjudication sessions to produce a gold standard labeled dataset.

This codebook became the foundation for everything that followed: the preference study, the automated quality classifier, and the platform's real-time quality scoring feature.

---

## Study Design

With the evaluation framework in place, I designed a controlled pairwise comparison study to measure educator preferences across the three authoring sources.

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/evaluation-methodology.svg" title="Evaluation methodology" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    The evaluation pipeline: 400 unique query sets generated lesson plans from three sources. Educators evaluated anonymized pairs side-by-side across four instructional measures, with open comment fields for qualitative feedback.
</div>

**The key design decisions:**

I created a pool of 400 unique query sets, each specifying a grade level, Common Core standard, title, and learning objectives. Each query generated three lesson plans (one from each authoring source), and evaluators saw anonymized, randomized pairs presented side-by-side. This blinding was critical for internal validity. Educators selected their preferred plan for each of four measures: warm-up activities, main instructional tasks, cool-down activities, and overall quality. Every selection included an open comment field where evaluators explained their reasoning.

I recruited 20 experienced K-12 math teachers (10+ years of classroom experience), ran orientation sessions, and conducted pilot training with 2-4 practice comparisons so evaluators could calibrate their judgments against the codebook. Over a 5-month period from March to July 2024, I held structured weekly check-ins with evaluators, monitored response quality, and addressed questions about edge cases. This yielded 529 evaluated lesson plan pairs, 2,116 measure-level evaluations, and 2,979 qualitative comments.

---

## Research Process

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/process-timeline.svg" title="Research process timeline" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    End-to-end research process from problem framing through product impact, spanning approximately 18 months.
</div>

---

## Analysis Approach

I used a mixed-methods analysis to triangulate what educators preferred and, more importantly, why.

**Quantitative analysis** used bootstrapped preference estimation with 1,000 resamples and 95% confidence intervals. Bootstrapping was necessary because the dataset had natural imbalances across author pairings and grade levels. Standard proportion tests would have given misleading precision. I computed preference distributions overall, by grade level (elementary, middle, high school), and by instructional measure.

**Qualitative analysis** combined LDA topic modeling with manual thematic coding across all 2,979 educator comments. The topic models surfaced recurring themes in educator reasoning, which I then validated and refined through careful reading and coding. This approach let me move between the statistical patterns (what educators chose) and the pedagogical reasoning (why they chose it) in a way that neither method could accomplish alone.

---

## Key Findings

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/preference-results.svg" title="Preference results" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Overall preferences favored human-authored plans, but AI competitiveness varied dramatically by grade level and instructional component. The fine-tuned LLaMA model surpassed human plans at the high school level.
</div>

The results were more nuanced than a simple "human vs. AI" story.

**Human-authored plans were preferred overall (42.1%)**, particularly for elementary grades where educators valued student engagement, scaffolding, and collaborative learning structures. At the elementary level, human plans dominated at 53.2%.

**But AI became genuinely competitive at the secondary level.** The fine-tuned LLaMA-2-13B model reached 37.9% preference at the high school level, exceeding human plans in main task quality. This was not a consolation result. Educators specifically praised AI-generated plans for their mathematical rigor and structured progression in higher-grade content.

**The most surprising finding was in cool-down activities**, where GPT-4 was preferred 59.7% of the time over human-authored plans. Educators noted that AI-generated cool-downs were more diagnostically useful, giving teachers clearer signals about what students had understood.

**The qualitative analysis revealed what was driving these patterns.** Educators valued human plans for nuanced differentiation, real-world contextualization, and student discourse facilitation. These are pedagogical skills that require deep understanding of how students actually interact in classrooms. AI plans were praised for structure, adaptability, and consistent formatting, but criticized for generic scaffolding and lack of collaborative learning activities.

---

## Impact

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/impact-outcomes.svg" title="Impact and outcomes" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Research findings translated directly into product architecture decisions, automated quality systems, and sustained funding.
</div>

These findings didn't just fill a knowledge gap. They changed how the product worked.

**The platform adopted a human-AI collaborative design philosophy:** AI generates structured drafts, and educators refine and customize. This was a direct consequence of seeing that AI's strengths (structure, consistency, efficiency) complemented rather than replaced human strengths (differentiation, discourse, contextualization).

**The gold standard dataset enabled an automated quality classifier** (multi-task BERT/RoBERTa, 88% accuracy across 10 metrics) that now runs in the lesson plan generation pipeline, giving teachers real-time quality scores alongside every generated plan. I also fine-tuned a LLaMA-3-8B model as a specialized evaluator that could both score and explain its ratings in educator-aligned language.

**The research contributed to securing continued funding:** Co-PI on NSF STTR Phase I and Co-PI on IES AmplifyGAIN (2024-2029), a national R&D center focused on generative AI for math and science education.

---

## What I Learned

Three things from this work that I carry forward:

**Evaluation criteria have to come from the people who will use the output.** Starting with automated metrics or researcher-defined rubrics would have missed the dimensions educators actually care about, like whether a warm-up activates the right prior knowledge or whether a cool-down gives actionable diagnostic information. The codebook development process was as valuable as the study itself.

**Grade-level context matters more than "AI vs. human" framing.** A blanket statement about AI quality would have been wrong. The AI models performed meaningfully differently across elementary, middle, and high school content, and understanding why required the qualitative analysis alongside the preference data.

**Sustained evaluator relationships produce better data.** Weekly check-ins over five months, pilot training, and treating educators as research partners (not just data sources) produced richer qualitative comments and more consistent quantitative judgments than a one-shot evaluation would have.

---

## Publications

- **Sarkar, S.**, Sun, M., Liu, A., Tian, Z., Esbenshade, L., He, J., & Zhang, Z. (2025). Connecting Feedback to Choice: Understanding Educator Preferences in GenAI vs. Human-Created Lesson Plans in K-12 Education. *arXiv Preprint.* [PDF](https://arxiv.org/pdf/2504.05449)

- **Sarkar, S.**, Liu, A., Shapiro, B., & Sun, M. (2025). Collaborative and Adaptive Learning: Designing AI Educational Systems with and for Educators. *ICLS 2025.* [PDF](https://repository.isls.org/bitstream/1/11722/1/ICLS2025_3150-3152.pdf)

- **Sarkar, S.**, Sun, M., Liu, A., & He, J. (2024). Providing Teachers with Quality, Relevant, and Useful Mathematical Lesson Materials Using a Domain-Specific Retrieval-Augmented Generation System. *SREE 2024.*
