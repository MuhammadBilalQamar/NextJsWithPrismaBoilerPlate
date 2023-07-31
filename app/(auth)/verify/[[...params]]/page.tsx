export default function Page({
  params: { params },
}: {
  params: {
    params: string[];
  };
}) {
  console.log(params)
  return (
    <>
      Verify Email
    </>
  )
}