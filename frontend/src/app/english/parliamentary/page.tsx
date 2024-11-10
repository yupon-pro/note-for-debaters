import Note from "@/features/english/parliament/components/Note";

// this component must be sever component because it call function to fetch resources to server.

export default function Parliamentary(){
  
const mockContent = `
  <table>
    <tbody>
      <tr>
        <td>OG</td>
        <td>OO</td>
      </tr>
      <tr>
        <td>CG</td>
        <td>CO</td>
      </tr>
    </tbody>
  </table>
  `
  
  return (
    <Note defaultContent={mockContent} />
  );
}