import assert from "node:assert/strict";
import test from "node:test";
import { mspReviewsJsonLd, serialiseJsonLd } from "../structuredData.ts";
import { mspReviewProfiles } from "./mspReviews.ts";

test("every current MSP gets one review profile with a unique route", () => {
  assert.equal(mspReviewProfiles.length, 129);
  assert.equal(new Set(mspReviewProfiles.map((profile) => profile.slug)).size, 129);
  assert.equal(new Set(mspReviewProfiles.map((profile) => profile.msp.memberId)).size, 129);
});

test("empty MSP pages do not invent aggregate-rating markup", () => {
  const data = mspReviewsJsonLd({
    name: "Example MSP",
    pagePath: "/msp-reviews/example-msp",
    officialProfileUrl: "https://www.parliament.scot/msps/example",
    image: "/images/example.webp",
    jobTitle: "Member of the Scottish Parliament",
    party: "Example Party",
    reviews: [],
  });
  const person = data["@graph"].find((item) => item["@type"] === "Person");
  assert.ok(person);
  assert.equal("aggregateRating" in person, false);
  assert.equal("review" in person, false);
});

test("review schema uses the same count and average as the visible reviews", () => {
  const data = mspReviewsJsonLd({
    name: "Example MSP",
    pagePath: "/msp-reviews/example-msp",
    officialProfileUrl: "https://www.parliament.scot/msps/example",
    image: "/images/example.webp",
    jobTitle: "Member of the Scottish Parliament",
    party: "Example Party",
    reviews: [
      { rating: 1, title: "First", body: "A detailed firsthand account.", authorName: "A Person", publishedDate: "2026-08-01" },
      { rating: 4, title: "Second", body: "Another detailed firsthand account.", authorName: "B Person", publishedDate: "2026-08-02" },
    ],
  });
  const person = data["@graph"].find((item) => item["@type"] === "Person");
  assert.ok(person && "aggregateRating" in person && "review" in person);
  const aggregate = person.aggregateRating;
  const reviews = person.review;
  assert.ok(aggregate && reviews);
  assert.equal(aggregate.ratingValue, 2.5);
  assert.equal(aggregate.reviewCount, 2);
  assert.equal(reviews.length, 2);
  assert.deepEqual(reviews[0].itemReviewed, { "@id": "https://scotlandcounted.org.uk/msp-reviews/example-msp#msp" });
});

test("approved review text cannot terminate the JSON-LD script", () => {
  const serialised = serialiseJsonLd({ reviewBody: "Real account </script><script>alert(1)</script>" });
  assert.equal(serialised.includes("</script>"), false);
  assert.match(serialised, /\\u003c\/script\\u003e/);
});
