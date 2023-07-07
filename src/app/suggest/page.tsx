export const config = {
  runtime: 'edge',
  regions: ['dub1'],
};

import SuggestForm from "~/components/SuggestForm";

export default async function Suggest() {
  return (
    <>
      <h1 className="text-slate-900 dark:text-white text-center p-5 text-3xl md:text-5xl">
        Suggest
      </h1>
      <SuggestForm />
    </>
  );
}
