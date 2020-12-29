import useSWR from 'swr'

function fetcher(url: string) {
  return window.fetch(url).then((res) => res.json())
}

export function useTemplates() {
  const { data, error } = useSWR(`/api/get-templates`, fetcher)
  console.log(data)
  return {
    templates: data,
    isLoading: !error && !data,
    isError: error,
  }
}

export function useTemplate(id: string) {
  return useSWR(`/api/get-template?id=${id}`, fetcher)
}
