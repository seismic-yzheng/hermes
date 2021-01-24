import useSWR from "swr";

function fetcher(url: string) {
  return window.fetch(url).then((res) => res.json());
}

export function getTemplate(id: string) {
  const { data, error } = useSWR(`/api/template/${id}`, fetcher);
  return {
    templateData: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function getTemplates() {
  const { data, error } = useSWR(`/api/templates/`, fetcher);
  return {
    templateData: data,
    isLoading: !error && !data,
    isError: error,
  };
}
