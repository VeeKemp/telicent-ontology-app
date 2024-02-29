export type RdfOutputProps = {
  rdf: string;
}

const RdfOutput = ({ rdf }: RdfOutputProps) => (
  <textarea
    value={rdf}
    rows={50}
    cols={100}
  />
);

export default RdfOutput;
