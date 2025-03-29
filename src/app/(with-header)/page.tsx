import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { asImageSrc, Content } from "@prismicio/client";
import { SliceZone, SliceComponentProps } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";

type TextAndImageBundleSlice = {
  id: string;
  slice_type: "parallax_bundle";
  slices: Content.ParallaxSlice[];
};

export default async function Page() {
  const client = createClient();
  const page = await client.getSingle("homepage").catch(() => notFound());

  const slices = bundleTextAndImageSlices(page.data.slices);

  return (
    <SliceZone
      slices={slices}
      components={{
        ...components,
        parallax_bundle: ({
          slice,
        }: SliceComponentProps<TextAndImageBundleSlice>) => (
          <div>
            <SliceZone slices={slice.slices} components={components} />
          </div>
        ),
      }}
    />
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const page = await client.getSingle("homepage").catch(() => notFound());

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
    openGraph: {
      images: [{ url: asImageSrc(page.data.meta_image) ?? "" }],
    },
  };
}

type ParallaxSlice = {
  id: string;
  slice_type: "parallax_bundle";
  slices: Content.ParallaxSlice[];
};

function bundleTextAndImageSlices(
  slices: Content.HomepageDocumentDataSlicesSlice[]
) {
  const res: (
    | Content.HomepageDocumentDataSlicesSlice
    | ParallaxSlice
  )[] = [];

  for (const slice of slices) {
    if (slice.slice_type !== "parallax") {
      res.push(slice);
      continue;
    }

    const bundle = res.at(-1);
    if (bundle?.slice_type === "parallax_bundle") {
      bundle.slices.push(slice);
    } else {
      res.push({
        id: `${slice.id}-bundle`,
        slice_type: "parallax_bundle",
        slices: [slice],
      });
    }
  }
  return res;
}