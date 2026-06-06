<template>
  <div class="full-transcript-content">
    <h3>Full Meeting Transcript</h3>
    <p>
      This is a simulated full transcript of the "Q3 Planning Sync: Steering Committee" meeting.
      In a real application, this content would be loaded dynamically from a service.
    </p>
    <p>
      <strong>[10:00 AM] Marcus J.:</strong> Good morning, team. Let's kick off the Q3 Planning Sync.
      Our main agenda today is to review the proposed budget shift for the infrastructure phase.
    </p>
    <p>
      <strong>[10:05 AM] Elena L.:</strong> Marcus, I've finalized the resource reallocation impact analysis.
      Based on our projections, approving the 12% budget shift to infrastructure is feasible and crucial for long-term stability.
    </p>
    <p>
      <strong>[10:15 AM] David C.:</strong> I concur with Elena. The infrastructure upgrade is a critical path item.
      We need to ensure Elena finalizes the Gantt chart by EOD Friday to reflect these changes.
    </p>
    <p>
      <strong>[10:20 AM] Sarah J.:</strong> Agreed. Elena, please ensure the Gantt chart is updated.
      Marcus, the budget shift is approved. Let's monitor the impact closely.
    </p>
    <p>
      <strong>[10:30 AM] Marcus J.:</strong> Excellent. Decision made: 12% budget shift approved.
      Action for Elena: finalize Gantt by EOD Friday. Thank you, team.
    </p>
    <p>
      <em>(End of simulated transcript)</em>
    </p>
  </div>
</template>

<script setup>
// No hay lógica compleja aquí, es solo contenido estático por ahora.
</script>

<style scoped>
.full-transcript-content {
  padding: 1rem;
  line-height: 1.6;
  color: #333;
  font-family: Arial, sans-serif;
  max-height: 70vh; /* Limita la altura del contenido del modal */
  overflow-y: auto; /* Permite scroll si el contenido es largo */
}

.full-transcript-content h3 {
  color: #1e293b;
  margin-top: 0;
  margin-bottom: 1rem;
}

.full-transcript-content p {
  margin-bottom: 0.8rem;
}

.full-transcript-content strong {
  color: #000;
}
</style>
