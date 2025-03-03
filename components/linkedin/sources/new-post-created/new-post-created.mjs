import common from "../common/polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "linkedin-new-post-created",
  name: "New Post Created",
  description: "Emit new event when a new post is created by the owner account. [See the documentation](https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api?view=li-lms-2024-09&tabs=curl#find-posts-by-authors).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  hooks: {
    ...common.hooks,
    async deploy() {
      const {
        app,
        setPersonId,
        setIsFirstRun,
      } = this;

      const { id } = await app.getCurrentMemberProfile();

      setPersonId(id);
      setIsFirstRun(true);
    },
  },
  methods: {
    ...common.methods,
    getDateField() {
      return "createdAt";
    },
    getResourceName() {
      return "elements";
    },
    getResourcesFn() {
      return this.app.listPosts;
    },
    getResourcesFnArgs() {
      const author = `urn:li:person:${this.getPersonId()}`;
      return {
        debug: true,
        params: {
          author,
          q: "author",
          sortBy: "CREATED",
        },
      };
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Person Post: ${resource.id}`,
        ts: resource.createdAt,
      };
    },
  },
  sampleEmit,
};
