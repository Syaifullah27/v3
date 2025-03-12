import { ThreeDots } from 'react-loader-spinner'

export default function Loader() {
  return (
    <div className="loader">
      <ThreeDots color="#818cf8" height={80} width={80} />
    </div>
  )
}