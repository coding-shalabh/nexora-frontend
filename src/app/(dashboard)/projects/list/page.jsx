/**
 * Redirect: /projects/list → /projects
 *
 * The main projects page (/projects) already shows the project list.
 */
import { redirect } from 'next/navigation';

export default function ProjectsListPage() {
  redirect('/projects');
}
