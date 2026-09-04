import { defineAction } from "astro:actions";

defineAction({
  handler: async ({ request }) => {
    const data = await request.formData();
    console.log(data);
  },
});
