
export interface Partner {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  type: 'company' | 'individual';
}

export interface Contributor {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  bio?: string;
  linkedin?: string;
  twitter?: string;
}

export const partners: Partner[] = [
  {
    id: '1',
    name: 'TechVet Solutions',
    logo: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=200&h=100&fit=crop&auto=format',
    website: 'https://techvet.com',
    type: 'company'
  },
  {
    id: '2',
    name: 'Pet Care Innovation Lab',
    logo: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=200&h=100&fit=crop&auto=format',
    website: 'https://petcareinnovation.com',
    type: 'company'
  },
  {
    id: '3',
    name: 'Veterinary AI Systems',
    logo: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=200&h=100&fit=crop&auto=format',
    website: 'https://vetai.com',
    type: 'company'
  },
  {
    id: '4',
    name: 'Digital Pet Health',
    logo: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=200&h=100&fit=crop&auto=format',
    website: 'https://digitalpethealth.com',
    type: 'company'
  }
];

export const contributors: Contributor[] = [
  {
    id: '1',
    name: 'Dr. Anna Kowalska',
    role: 'Veterinary Advisor',
    avatar: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=150&h=150&fit=crop&auto=format',
    bio: 'Leading veterinary specialist with 15+ years of experience',
    linkedin: 'https://linkedin.com/in/annakowalska'
  },
  {
    id: '2',
    name: 'Marcin Nowak',
    role: 'Technology Consultant',
    avatar: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=150&h=150&fit=crop&auto=format',
    bio: 'Expert in veterinary software solutions',
    twitter: 'https://twitter.com/marcinnowak'
  },
  {
    id: '3',
    name: 'Prof. Barbara Wiśniewska',
    role: 'Animal Behavior Expert',
    avatar: 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=150&h=150&fit=crop&auto=format',
    bio: 'Research professor specializing in animal psychology',
    linkedin: 'https://linkedin.com/in/barbarawisniewska'
  }
];
