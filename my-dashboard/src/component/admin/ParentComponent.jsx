import PipelineCard from './PipelineCard';

const cards = [
  {
    id: '1',
    stage: 'New',
    color: 'teal',
    icon: '🟢',
    leadCount: 24,
    avgTime: '3d',
    conversion: '12%',
    title: 'New Leads',
    desc: 'Initial leads just entered the pipeline.',
  },
  {
    id: '2',
    stage: 'Qualified',
    color: 'blue',
    icon: '🔵',
    leadCount: 15,
    avgTime: '5d',
    conversion: '20%',
    title: 'Qualified Prospects',
    desc: 'Potential clients validated by SDR.',
  },
  {
    id: '3',
    stage: 'Proposal',
    color: 'orange',
    icon: '📄',
    leadCount: 8,
    avgTime: '2d',
    conversion: '35%',
    title: 'Proposal Sent',
    desc: 'Formal proposals sent to client.',
  },
];

const ParentComponent = () => {
  return (
    <div className="flex flex-wrap gap-4 p-6">
      {cards.map((data, i) => (
        <PipelineCard key={data.id} {...data} delay={i * 0.1} />
      ))}
    </div>
  );
};

export default ParentComponent;
